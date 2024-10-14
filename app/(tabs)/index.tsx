import { Image } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import {
  StyleSheet, Text, View, StatusBar} from 'react-native';


 
export default function HomeScreen() {







  return (

    <View style={styles.container}>
    <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
    <Text style={styles.heading}>Home</Text>
    <HelloWave />

        <View style={styles.form}>
            <Text style={styles.label}>Crud feito com React navite + Expo + Node js como Back-End + SQlite</Text>

            <Text style={styles.label}>Back-End com deploy em Render</Text>
       
  
      </View>
    
   
      





   
    </View>

    

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
 
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
  },


  content: {
    backgroundColor: '#FFF',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  }
});


