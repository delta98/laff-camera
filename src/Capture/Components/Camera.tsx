import * as React from 'react'
import { Animated, StyleSheet } from 'react-native'
import { RNCamera, RNCameraProps, RecordResponse } from 'react-native-camera'

import FlashButtonCompoonent from '../Components/Buttons/FlashButton'
import MediaLibraryButtonComponent from '../Components/Buttons/MediaLibraryButton'
import CameraRotateButtonComponent from '../Components/Buttons/CameraRotateButton'
import CameraCaptureButtonCompoonent from '../Components/Buttons/CameraCaptureButton'

interface CameraProps extends RNCameraProps {
    captureFinishedHandler?: (uri: string) => void
}

interface CameraState {
    recording: boolean
    percentage: number
    flashActive: boolean
    captureDisabled: boolean
    cameraMode: CameraMode
    ready: boolean
}

enum CameraMode {
    FRONT,
    BACK,
}

export default class Camera extends React.Component<CameraProps, CameraState> {
    private camera: RNCamera
    private recordingTimer: any
    private recordingTimeElapsed: number
    private cameraReadyOpacity: Animated.Value

    constructor(props) {
        super(props)

        this.startCapture = this.startCapture.bind(this)
        this.state = {
            recording: false,
            percentage: 0,
            flashActive: false,
            captureDisabled: true,
            cameraMode: CameraMode.BACK,
            ready: false,
        }
    }

    render() {
        this.cameraReadyOpacity = new Animated.Value(this.state.ready ? 1 : 0.2)
        return (
            <Animated.View style={styles.container}>
                <RNCamera
                    {...this.props}
                    ref={ref => {
                        this.camera = ref
                    }}
                    style={styles.preview}
                    autoFocus={RNCamera.Constants.AutoFocus.on}
                    type={
                        this.state.cameraMode === CameraMode.BACK
                            ? RNCamera.Constants.Type.back
                            : RNCamera.Constants.Type.front
                    }
                    flashMode={
                        this.state.flashActive
                            ? RNCamera.Constants.FlashMode.torch
                            : RNCamera.Constants.FlashMode.off
                    }
                    onCameraReady={() => {
                        Animated.timing(this.cameraReadyOpacity, {
                            toValue: this.state.ready ? 1 : 0.2,
                            duration: 500,
                        }).start(() => {
                            this.setState({
                                ...this.state,
                                ready: true,
                                captureDisabled: false,
                            })
                        })
                    }}
                >
                    <Animated.View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            opacity: this.cameraReadyOpacity.interpolate({
                                inputRange: [0.2, 1],
                                outputRange: [0.2, 1],
                            }),
                        }}
                    >
                        <FlashButtonCompoonent
                            active={this.state.flashActive}
                            activationHandler={this.flashToggle}
                            hidden={
                                this.state.cameraMode !== CameraMode.BACK ||
                                this.state.recording
                            }
                        />
                    </Animated.View>
                    <Animated.View
                        style={{
                            flex: 1,
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                            alignContent: 'space-between',
                            flexDirection: 'row',
                            opacity: this.cameraReadyOpacity.interpolate({
                                inputRange: [0.2, 1],
                                outputRange: [0.2, 1],
                            }),
                        }}
                    >
                        <CameraRotateButtonComponent
                            rotationHandler={this.changeCameraMode}
                            disabled={!this.state.ready || this.state.recording}
                        />
                        <CameraCaptureButtonCompoonent
                            startCaptureHandler={this.startCapture}
                            stopCaptureHandler={this.stopCapture}
                            recording={
                                this.state.recording &&
                                !this.state.captureDisabled
                            }
                            percentage={this.state.percentage * 360}
                            handlerDisabled={this.state.captureDisabled}
                        />
                        <MediaLibraryButtonComponent
                            disabled={!this.state.ready || this.state.recording}
                        />
                    </Animated.View>
                </RNCamera>
            </Animated.View>
        )
    }

    startCapture = async () => {
        if (this.camera) {
            this.__resetCaptureAnimation()
            this.setState({
                ...this.state,
                recording: true,
            })

            this.recordingTimer = setInterval(() => {
                this.recordingTimeElapsed += 1

                const percentage = this.recordingTimeElapsed / 480

                this.setState({
                    ...this.state,
                    percentage: percentage,
                })
            }, 50)

            this.camera
                .recordAsync({
                    quality: RNCamera.Constants.VideoQuality['720p'],
                    maxDuration: 30,
                })
                .then((response: RecordResponse) => {
                    this.stopCapture()
                    this.props.captureFinishedHandler(response.uri)
                })
                .catch((error: Error) => {
                    console.log(error.message)
                })
        }
    }

    stopCapture = () => {
        if (this.camera) {
            this.setState({
                recording: false,
                percentage: 0,
                flashActive: false,
                captureDisabled: false,
                cameraMode: CameraMode.BACK,
                ready: true,
            })
            this.__resetCaptureAnimation()
            this.camera.stopRecording()
        }
    }

    flashToggle = () => {
        if (this.camera) {
            this.setState({
                ...this.state,
                flashActive: !this.state.flashActive,
            })
        }
    }

    changeCameraMode = () => {
        this.setState({
            ...this.state,
            flashActive: false,
            cameraMode:
                this.state.cameraMode === CameraMode.BACK
                    ? CameraMode.FRONT
                    : CameraMode.BACK,
        })
    }

    private __resetCaptureAnimation = () => {
        this.recordingTimeElapsed = 0
        clearInterval(this.recordingTimer)
        this.setState({
            ...this.state,
            percentage: 0,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    preview: {
        flex: 1,
        flexDirection: 'column',
    },
})
