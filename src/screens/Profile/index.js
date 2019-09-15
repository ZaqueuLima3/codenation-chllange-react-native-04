import React from 'react';
import moment from 'moment';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import {
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

import CameraApp  from '../CameraApp';

import { profile } from '../../data/profile'

import styles from './style';

export default class Profile extends React.PureComponent {
  fadeAnimation = new Animated.Value(0)

  state = {
    hasCameraPermission: null,
    userImage: null,
    modalVisible: false,
    type: Camera.Constants.Type.back,
    loading: true,
  }

  async componentWillMount() {
    this.handleLoadImage();
  }

  async componentDidMount() {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);

      this.setState({ hasCameraPermission: status === 'granted' })
      this.finishLoading()
  }

  handleLoadImage = async () => {
    try {
      const userImage = await AsyncStorage.getItem('userImage');

      if (userImage !== null || userImage !== '') {
        this.setState({ userImage });
      }
    } catch (e) {
      // error
    }
  }

  handleCloseModal = () => {
    this.handleLoadImage();
    setTimeout(() => {
      this.setState({ modalVisible: false });
    },  500)
    
  }

  goToCamera = () => {
    const { hasCameraPermission } = this.state;
    
    if (!!hasCameraPermission) {
      this.setState({ modalVisible: true})
    }
  }

  finishLoading = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      Animated.timing(this.fadeAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start()

      this.setState({ loading: false })
    } catch (error) {
      console.error(error)
    }
  }

  render() {
    const { hasCameraPermission, userImage, modalVisible } = this.state;

    const profileImage = userImage || profile.picture;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            className="header-image"
            style={styles.headerImage}
            source={{ uri: 'https://forum.codenation.com.br/uploads/default/original/2X/2/2d2d2a9469f0171e7df2c4ee97f70c555e431e76.png' }}
          />
        </View>

        <ScrollView>
          <View style={styles.profileTitle}>
            <TouchableOpacity 
              className="profile-image-btn" 
              onPress={this.goToCamera}
            >
              <Image
                className="profile-image"
                style={styles.profileImage}
                source={{uri: profileImage }}
              />
            </TouchableOpacity>
            <Text className="profile-name" style={styles.profileName}>{profile.name}</Text>
          </View>
          <Animated.View className="contact-content" style={[styles.userContent, { opacity: this.fadeAnimation }]}>
              <Text className="contact-label" style={styles.contentLabel}>Linkedin:</Text>
              <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>{profile.linkedin}</Text>

              <Text className="contact-label" style={styles.contentLabel}>Github:</Text>
              <Text className="contact-value" style={styles.contentText}>{profile.github}</Text>
          </Animated.View>
          <Animated.View className="contact-content" style={[styles.userContent, { opacity: this.fadeAnimation }]}>
              <Text className="contact-label" style={styles.contentLabel}>E-mail:</Text>
              <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>{profile.email}</Text>

              <Text className="contact-label" style={styles.contentLabel}>Celular:</Text>
              <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>{profile.phone}</Text>

              <Text className="contact-label" style={styles.contentLabel}>Data de Nascimento:</Text>
              <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>
                {moment(profile.birthday).format('DD/MM/YYYY')}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>Sexo:</Text>
              <Text className="contact-value" style={{...styles.contentText, ...styles.mBottom}}>
                {profile.gender === 1 ? 'Masculino' : 'Feminino'}
              </Text>

              <Text className="contact-label" style={styles.contentLabel}>Idiomas:</Text>
              <View style={styles.languageContent}>
                {profile.language.map(language => (
                  <View key={language} style={styles.language}>
                    <Text className="contact-language" style={styles.languageText}>
                      {language}
                    </Text>
                  </View>
                ))}
              </View>
          </Animated.View>
        </ScrollView>
        {modalVisible && 
          <CameraApp 
            modalVisible={modalVisible}
            closeModal={this.handleCloseModal} 
          />
        }
      </View>
    );
  }
}
