import React, {useState} from 'react';
import {Button, Heading, NoContent} from '@/components';
import LoadingScreen from '@/screens/LoadingScreen';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, View, Alert, Platform, RefreshControl} from 'react-native';
import RNFS from 'react-native-fs';
import useFiles from '@/hooks/useFiles';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledScrollView = styled(ScrollView);

const FilesScreen = () => {
  const {files, loading, error, fetchFilesRefresh} = useFiles();
  const [refreshing, setRefreshing] = useState(false);
  const {t} = useTranslation();

  const handlePress = async (fileUrl: string, fileName: string) => {
    try {
      const downloadDir =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.DownloadDirectoryPath;

      const filePath = `${downloadDir}/${fileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: fileUrl,
        toFile: filePath,
      }).promise;

      if (result.statusCode === 200) {
        Alert.alert(t('Udało się! ✅'), t('Plik został pobrany.'));
      } else {
        throw Error();
      }
    } catch (err) {
      Alert.alert(t('Błąd ❌'), t('Wystąpił błąd podczas pobierania pliku.'));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFilesRefresh();
    setRefreshing(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledScrollView
        contentContainerStyle={{flexGrow: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Heading title={t('Pliki')} classes="mb-6" />
        <StyledView className="flex-1 px-4">
          {files.length === 0 || error ? (
            <NoContent elementName="plików" />
          ) : (
            files.map((file, idx) => (
              <Button
                key={idx}
                text={file.name}
                onPress={() => handlePress(file.dddfile, file.name)}
                className="rounded-lg bg-lightPurple p-2 mb-2"
              />
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledSafeAreaView>
  );
};

export default FilesScreen;
