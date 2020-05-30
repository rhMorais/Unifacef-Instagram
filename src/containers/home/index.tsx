/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

import HomeStore from '../../stores/home.store';
import { Layout, Card, Avatar, Divider, Text, Button } from '@ui-kitten/components';
import { ScrollView, View, Image, StyleSheet, Alert, RefreshControl, Vibration } from 'react-native';
import { Camera } from '../../components/camera.component';
import { TextInput } from 'react-native-gesture-handler';

interface Props {
  homeStore: HomeStore,
  navigation: any;
}

@inject('homeStore')
@observer
export default class Home extends Component<Props> {

  async componentDidMount() {
    this.getPosts();
  }

  async getPosts() {
    const { getPosts } = this.props.homeStore;
    try {
      await getPosts();
    } catch (error) {
      Vibration.vibrate(1 * 1000);
      Alert.alert(
        'Erro',
        error.message
      );
      console.log(error);
    }
  }

  render() {
    const { posts, photoReady, toogleStatus, addPost, loading } = this.props.homeStore;

    const uploadPhoto = (uri?: string) => {
      if (uri) {
        // <View style={{ padding: 10 }}>
        //   <TextInput
        //     placeholder="Escreva uma legenda!"
        //     onChangeText={text => setText(text)}
        //   />
        //   <Button onPress={() => addPost(uri)} title={'Confirmar'} />
        //   <Button>Cancelar</Button>
        // </View>;
        Alert.alert(
          'Confirmação',
          'Deseja realmente postar?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            { text: 'OK', onPress: () => addPost(uri) },
          ],
          { cancelable: false }
        );
      }
      toogleStatus(false);
    };

    return (
      <Layout style={{ flex: 1 }}>
        <ScrollView refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => this.getPosts()} />
        }>
          <Camera status={photoReady} onTakeCamera={(uri) => uploadPhoto(uri)} />
          {photoReady === false && <Button onPress={() => toogleStatus(true)}>Postar</Button>}
          {photoReady === false && posts.map((post, index) => (
            <Card key={index} style={styles.card}>
              <View style={styles.header}>
                <Avatar
                  size={'small'}
                  source={{ uri: post.author.avatar }}
                  style={styles.avatar} />
                <Text style={styles.title}>{post.author.name}</Text>
              </View>
              <Image style={styles.picture} source={{ uri: post.image }} />
              <Divider />
              <View style={styles.footer}>
                <Text style={styles.title}>{post.description}</Text>
              </View>
            </Card>))}
        </ScrollView>
      </Layout>);
  }
}

const styles = StyleSheet.create({
  card: { padding: 1, margin: 4, backgroundColor: 'black' },
  header: {
    padding: 3,
    alignItems: 'center',
    flexDirection: 'row',
  },
  scrollView: {
    backgroundColor: 'black',
    color: 'white',
    marginHorizontal: 20,
  },
  avatar: { marginRight: 5 },
  picture: { width: 'auto', minHeight: 200, maxHeight: 500 },
  footer: {
    margin: 4,
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 15,
  },
});
