import React from 'react';
import { Text, View, Modal, TouchableOpacity, StatusBar, AsyncStorage } from 'react-native';
import { Camera } from 'expo-camera';

export default class CameraApp extends React.Component {

  state = {
    type: Camera.Constants.Type.back,
  };

  handleTakePicture = async () => {
    const { closeModal } = this.props;

    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      let photo = await this.camera.takePictureAsync(options)
      await AsyncStorage.setItem('userImage', photo.uri);
      closeModal();
    }
  }

  render() {
    const { modalVisible, closeModal } = this.props;

    return (
      <Modal 
        style={{ flex: 1 }}
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <StatusBar hidden className="status-bar" />
        <Camera 
          className="camera-container" 
          style={{ flex: 1 }} 
          type={this.state.type}
          ref={cameraRef => {
            this.camera = cameraRef;
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            
            <TouchableOpacity className="camera-close" onPress={closeModal} style={{padding: 10}}>
              <Text style={{ fontSize: 25, marginBottom: 10, color: 'white' }}>x</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              className="camera-shot"
              onPress={this.handleTakePicture}
            >
              <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Tirar foto</Text>
            </TouchableOpacity>


          </View>
        </Camera>
      </Modal>
    );
  }
}