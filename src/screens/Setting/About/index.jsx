import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'

const About = ({ navigation }) => {
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
                <View style={{
                            paddingTop: 12
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: '600'}}>
                                Tentang Aplikasi Menghafal Alquran
                            </Text>
                            <Text style={{ marginTop: 8, fontSize: 12, lineHeight: 20, textAlign: 'justify' }}>
                                Aplikasi menghafal Al-Quran ini diinisiasi oleh dosen Jurusan Informatika dan dosen Fakultas Ilmu Agama Islam (FIAI) Universitas Islam Indonesia. Tim pelaksana program adalah dua programmer dari mahasiswa program studi Informatika. Program ini merupakan hibah penelitian unggulan Direktorat Penelitian dan Pengabdian Masyarakat UII tahun 2022. Aplikasi ini akan didedikasikan ke masyarakat melalui komunitas Pusat Kontribusi Digital Islami (Contribution Center of Islamic Technology).
                            </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 12}}>
                        Versi Aplikasi
                    </Text>
                    <View style={{ marginTop: 12 }}>
                        <Text>1.01</Text>
                        <Text style={{ fontSize: 12, marginTop: 8, lineHeight: 20}}>
                            Minimum Viable Product dengan fitur:{'\n'}
                            1. Mushaf Juz 30 dengan layout Alquran standar Indonesia{'\n'}
                            2. Fitur pencatatan progress hafalan{'\n'}
                            3. Fitur pengaturan mode tikrar dan tutup ayat{'\n'}
                            4. Fitur audio dan mode perulangan{'\n'}
                            5. Terjemah ayat{'\n'}
                            6. Fitur pencarian ayat{'\n'}
                            7. Fitur pencarian surat{'\n'}
                            8. Fitur pencarian juz{'\n'}
                            9. Riwayat Hafalan{'\n'}
                            10. Catatan pada ayat{'\n'}
                        </Text>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default About;