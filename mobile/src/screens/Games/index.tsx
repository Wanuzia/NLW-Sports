import { SafeAreaView } from 'react-native-safe-area-context';
import { Background } from '../../components/Background';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { GameParams } from '../../@types/navigation';
import { TouchableOpacity, View, Image, FlatList, Text } from 'react-native';
import {Entypo} from '@expo/vector-icons'
import { THEME } from '../../theme';
import logoImg from '../../assets/logo-nlw-sports.png'
import { Heading } from '../../components/Heading';
import { DuoCard, DuoCardProps } from '../../components/DuoCard';
import { useState, useEffect } from 'react';
import { DuoMatch } from '../../components/DuoMatch';


export function Games() {
    const route = useRoute();
    const game = route.params as GameParams;
    const [duos, setDuos] = useState<DuoCardProps[]>([])
    const [discordDuoSelected, setDiscordDuoSelected] = useState('')

    function handleGoBack() {
     const navigator = useNavigation()
      navigator.goBack();
    }

    async function getDiscordUser(adsId:string) {
      fetch(`http://192.168.43.7:3002/ads/${adsId}/ads/discord`)
      .then(res => res.json())
      .then(data => 
       setDiscordDuoSelected(data.discord))
    }

    useEffect(() => {
      fetch(`http://192.168.43.7:3002/games/${game.id}/ads`)
      .then(res => res.json())
      .then(data => setDuos(data))
    }, []);
  
    
  return (
    <Background>
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                <Entypo 
                name="chevron-thin-left"
                color={THEME.COLORS.CAPTION_300}
                size={20}
                />
                </TouchableOpacity>
                <Image 
                source={logoImg}
                style={styles.logo}
                />
            <View style={styles.right} />
            </View>

              <Image
              source={{ uri: game.bannerUrl}}
              style={styles.cover}
              resizeMode = "cover"
              />
            <Heading 
            title={game.title}
            subtitle="Conecte-se e comece a jogar!"
            />
            <FlatList 
            data={duos}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <DuoCard 
              data={item} 
              onConnect={() => getDiscordUser(item.id)}
              />
            )}
            horizontal
            style={styles.containerList}
            contentContainerStyle={[duos.length > 0 ? styles.contentlist : styles.emptyListContent]}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyListText}>
                Não há anúncios publicados ainda.
              </Text>
  )}
            />
            < DuoMatch 
            onClose={() => setDiscordDuoSelected("")}
          visible={discordDuoSelected.length > 0} discord={discordDuoSelected}            />
        </SafeAreaView>
    </Background>
  );
}