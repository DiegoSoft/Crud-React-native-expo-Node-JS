import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { HelloWave } from '@/components/HelloWave';
import {
  StyleSheet, Text, View, StatusBar, TextInput, Platform, Pressable, Button, ScrollView, ActivityIndicator, Modal, FlatList, TouchableOpacity
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { Picker } from '@react-native-picker/picker';





const statusBarHeight = StatusBar.currentHeight


export default function ExploreScreen() {
  let emptyUser = {
    id: null,
    name: '',
    senha: '',
    perfil: '',
    status: ''

  };
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const showToast = () => {
    Toast.show({
      text1: '¡Sucesso!',
      text2: 'Operação com sucesso ! ✅',
      position: 'top',
      visibilityTime: 3000,
      type: 'success',
    });
  };

  const showToastErrorCampos = () => {
    Toast.show({
      text1: '¡Error!',
      text2: 'Não pode ter campos em braco 🚫',
      position: 'top',
      visibilityTime: 3000,
      type: 'error',
    });
  };

  const showToastError = () => {
    Toast.show({
      text1: '¡Error!',
      text2: 'Error na operação 🚫',
      position: 'top',
      visibilityTime: 3000,
      type: 'error',
    });
  };


  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState(null);
  const [_usuarios, set_Usuarios] = useState(emptyUser);
  const [userid, setUserid] = useState('');





  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };
  const openModalEdit = () => {
    setModalEdit(true);
  };
  const closeModalEdit = () => {
    setModalEdit(false);
  };




  useEffect(() => {
    axios.get('http://localhost:8080/users')  
      .then(response => setUsuarios(response.data))
  }, [_usuarios]);


  const handleModaldelete = (item?: any) => {
    set_Usuarios(item)
    setUserid(item.id)
    openModal();

  }

  const handleModalEdit = (item?: any) => {
    set_Usuarios(item)
    openModalEdit();

  }

  const handleModaCreate = () => {
    set_Usuarios(emptyUser);
    openModalEdit();

  }



  const handleDelete = (item?: any) => {
    axios.delete('http://localhost:8080/users/' + userid)
      .then(response => {
        showToast();

      })
      .catch(error => {
        console.log(error);
      });

    closeModal();
    set_Usuarios(emptyUser);
    setUserid('');
  }


  const handleCreateEdit = () => {

    if (!_usuarios.name || !_usuarios.perfil || !_usuarios.status) {

      console.log(_usuarios)
      showToastErrorCampos();
      closeModalEdit();
    } else {

      if (_usuarios.id) {
        axios.put('http://localhost:8080/users/update/' + _usuarios.id, _usuarios)
          .then(response => {

            showToast();
          })
          .catch(error => {
            showToastError();
            console.log(error);
          });

        set_Usuarios(emptyUser);
        closeModalEdit();



      } else {



        axios.post('http://localhost:8080/users/create', _usuarios)
          .then(response => {

            showToast();
          })
          .catch(error => {
            showToastError
            console.log(error);
          });


        set_Usuarios(emptyUser);
        closeModalEdit();
      }
    }
  }

  const onInputChange = (val: string, name: string) => {

    set_Usuarios((prevUsuarios) => ({
      ...prevUsuarios,
      [name]: val,
    }));
  };

  const onPickerChange = (itemValue: string) => {
    set_Usuarios((prevUsuarios) => ({
      ...prevUsuarios,
      status: itemValue,
    }));
  };


  const onPickerChangePerfil = (itemValue: string) => {
    set_Usuarios((prevUsuarios) => ({
      ...prevUsuarios,
      perfil: itemValue,
    }));
  };


  return (


    <View style={styles.container}>


      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#F1F1F1" />
      <Text style={styles.heading}>CRUD Usuários</Text>
      <HelloWave />


      <Text>{'\n'}</Text>
      <Text>{'\n'}</Text>



      <Pressable style={styles.button} onPress={handleModaCreate} >
        <Text style={styles.buttonText}>+ Criar</Text>
        <MaterialIcons name="people-alt" size={24} color="#FFF" />
      </Pressable>



  <View style={styles.containerScroll}  >
  
      {loading && (
        <View style={styles.content}>
          <Text style={styles.title}>Carregando roteiro...</Text>
          <ActivityIndicator color="#000" size="large" />
        </View>
      )}

      {usuarios && (
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Usuario</Text>
            <Text style={styles.headerText}>Status</Text>
            <Text style={styles.headerText}>Perfil</Text>
            <Text style={styles.headerText}>Ações</Text>
          </View>

          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (


              <View style={styles.row}>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.status}</Text>
                <Text style={styles.cell}>{item.perfil}</Text>
                <TouchableOpacity onPress={() => handleModalEdit(item)}>
                  <MaterialIcons name="edit" size={20} color="#3171B9" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleModaldelete(item)}>
                  <MaterialIcons name="delete" size={20} color="#DF6A6A" />
                </TouchableOpacity>
              </View>


            )} />

        </View>
      )}

</View>





      <Toast />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar</Text>
            <Text>Tem certeza que quer excluir o usuario: {_usuarios.name}?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleDelete} style={styles.confirmButton}>
                <Text style={styles.closeButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEdit}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Usuário</Text>


            <View style={styles.form}>
              <Text style={styles.label}>Usuario</Text>
              <TextInput

                style={styles.input}
                value={_usuarios.name}
                onChangeText={(val) => onInputChange(val, 'name')}
              />


              {_usuarios.id ? (

                <View>
                  <TextInput
                    style={styles.hiddenInput}
                    value={_usuarios.senha}
                    onChangeText={(val) => onInputChange(val, 'senha')}
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput

                    style={styles.input}
                    value={_usuarios.senha || ''}
                    onChangeText={(val) => onInputChange(val, 'senha')}
                  />
                </View>
              )}


              <Text style={styles.label}>Status</Text>
              <Picker
                selectedValue={_usuarios.status}
                onValueChange={onPickerChange}
                style={styles.input}
              >
                <Picker.Item label="Seleccionar" value="" />
                <Picker.Item label="Activo" value="Activo" />
                <Picker.Item label="Inativo" value="Inativo" />

              </Picker>

              <Text style={styles.label}>Perfil</Text>
              <Picker
                selectedValue={_usuarios.perfil}
                onValueChange={onPickerChangePerfil}
                style={styles.input}
              >
                <Picker.Item label="Seleccionar" value="" />
                <Picker.Item label="Admin" value="Admin" />
                <Picker.Item label="Usuario" value="Usuario" />

              </Picker>

            </View>


            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={closeModalEdit} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleCreateEdit} style={styles.confirmButton}>
                <Text style={styles.closeButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? statusBarHeight : 54
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
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#94a3b8',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  days: {
    backgroundColor: '#F1f1f1'
  },
  button: {
    backgroundColor: '#009688',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  button_: {
    backgroundColor: '#DF6A6A', // Color de fondo
    padding: 10, // Espaciado interno
    borderRadius: 2, // Bordes redondeados
    marginHorizontal: 2, // Espaciado horizontal
  },


  button_edit: {
    backgroundColor: '#3171B9', // Color de fondo
    padding: 10, // Espaciado interno
    borderRadius: 1, // Bordes redondeados
    marginHorizontal: 1, // Espaciado horizontal
  },

  buttonText_: {
    color: '#FFFFFF', // Color del texto
    fontWeight: 'bold', // Negrita
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold'
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
    width: '100%',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10, // Reduce el padding vertical
    paddingHorizontal: 5, // Ajusta el padding horizontal
    backgroundColor: '#f8f8f8', // Color de fondo opcional
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 1, // Ajusta el padding horizontal
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    fontSize: 14,

  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    width: 315,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    width: '100%',
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#009688', // Color verde
    borderRadius: 5,
    marginRight: 10,
  },

  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },

  hiddenInput: {
    height: 0,
    width: 0,
    borderWidth: 0,
    opacity: 0, // Para que fique oculto visualmente
  },
});


