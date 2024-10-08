import React from 'react';
import {styled} from 'nativewind';
import Box from '@/components/Box';
import {View} from 'react-native';
import {
  ScanEye,
  CreditCard,
  Files,
  Folder,
  BookOpenCheck,
  Settings,
} from 'lucide-react-native';
import {useTranslation} from 'react-i18next';

const StyledView = styled(View);

const dashboardElemsData = [
  {
    text: 'Odczyt karty',
    icon: <ScanEye className="text-darkPurple" size={40} />,
    nav: 'cardReader',
  },
  {
    text: 'Pliki',
    icon: <Folder className="text-darkPurple" size={40} />,
    nav: 'files',
  },
  {
    text: 'Dokumenty',
    icon: <Files className="text-darkPurple" size={40} />,
    nav: 'documents',
  },
  {
    text: 'Raporty',
    icon: <BookOpenCheck className="text-darkPurple" size={40} />,
    nav: 'reports',
  },
  {
    text: 'Kup czytnik',
    icon: <CreditCard className="text-darkPurple" size={40} />,
    nav: 'readers',
  },
  {
    text: 'Ustawienia',
    icon: <Settings className="text-darkPurple" size={40} />,
    nav: 'settings',
  },
];

const DashboardElements = () => {
  const {t} = useTranslation();
  return (
    <StyledView className="flex flex-wrap flex-row justify-between px-5">
      {dashboardElemsData.map((elem, idx) => (
        <Box text={t(elem.text)} icon={elem.icon} nav={elem.nav} key={idx} />
      ))}
    </StyledView>
  );
};

export default DashboardElements;
