import React, {useState, useEffect} from 'react';
import {styled} from 'nativewind';
import {TouchableOpacity, Text, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Heading} from '@/components';
import {useTranslation} from 'react-i18next';
import {ScanEye, MailCheck, CircleX} from 'lucide-react-native';
import useReaderIOS from '@/hooks/useReaderIOS';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledView = styled(View);
const StyledActivityIndicator = styled(ActivityIndicator);
const StyledSafeAreaView = styled(SafeAreaView);

const CardReaderScreen = () => {
  const {t} = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  // const [email, setEmail] = useState(false);
  const [error, setError] = useState('');
  const {connectAndRead} = useReaderIOS();

  // useEffect(() => {
  //   const checkEmail = async () => {
  //     try {
  //       const mail = await AsyncStorage.getItem('email');
  //       setEmail(mail);
  //     } catch (err) {
  //       setEmail('');
  //       setError(err);
  //     }
  //   };

  //   checkEmail();
  // }, []);

  const handlePress = async () => {
    setLoading(true);
    try {
      await connectAndRead();
      setSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = () => {
    if (loading) {
      return <StyledActivityIndicator size="large" color="#6B46C1" />;
    }

    if (success) {
      return <MailCheck size={72} className="text-darkPurple mb-4" />;
    }

    if (error) {
      return <CircleX size={72} className="text-darkPurple mb-4" />;
    }

    return <ScanEye size={72} className="text-darkPurple mb-4" />;
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple justify-start items-center pt-6">
      <Heading title={t('Odczyt karty')} />
      <StyledTouchableOpacity
        className="btn bg-slate-200 w-[70vw] p-3 mb-4 rounded-xl aspect-square shadow-xl absolute top-[50%] -translate-y-20"
        onPress={handlePress}
        disabled={loading || success || error}>
        <StyledView className="flex-1 justify-center items-center p-4">
          {renderIcon()}
          <StyledText className="text-2xl font-light text-darkPurple">
            {!loading && !success && !error && t('Kliknij, aby odczytać')}
            {!loading && success && !error && t('Plik wysłany')}
            {!loading && !success && error && t('Błąd')}
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledSafeAreaView>
  );
};

export default CardReaderScreen;
