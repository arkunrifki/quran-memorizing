import { SafeAreaView, View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from '@expo/vector-icons'

const Contact = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View
                style={{
                    padding: 20,
                }}
            >
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4}} onPress={() => navigation.navigate('Setting')}>
                    <Ionicons name="chevron-back-sharp" size={16} color="#969696" />
                    <Text style={{ fontSize: 16, marginLeft: 8, color: '#969696' }}>Pengaturan</Text>
                </TouchableOpacity>
                <View
                    style={{
                        marginTop: 20,
                    }}
                >
                    <Text style={{ marginTop: 8, fontSize: 14, lineHeight: 20, textAlign: 'justify' }}>Apabila Anda menemukan kebaikan dalam aplikasi ini, maka sesungguhnya itu datangnya dari Allah. Dan apabila Anda menemukan kekurangan dan kesalahan, sesungguhnya itu datang dari kami. {`\n`}{`\n`}Apabila Anda memiliki kritik, koreksi, ataupun masukan untuk aplikasi Tikrar, sila hubungi kami melalui WhatsApp di tombol berikut:</Text>
                </View>
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        borderRadius: 4,
                        borderWidth: 1,
                        borderColor: '#16a34a',
                        backgroundColor: '#16a34a',
                        marginTop: 20,
                        justifyContent: 'center'
                    }}
                    onPress={() => {
                        Linking.openURL(
                            'http://api.whatsapp.com/send?phone=6281328115353&text=Assalamualaikum%20Admin%20Tikrar'
                        )
                    }}
                >
                    <Text style={{ color: '#FFFFFF', fontWeight: '700'}}>Hubungi Pengembang</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Contact;