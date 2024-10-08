import React from 'react';
import {styled} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import useReport from '@/hooks/useReport';
import LoadingScreen from '@/screens/LoadingScreen';
import {NoContent, Heading} from '@/components';
import moment from 'moment';
import Timeline from 'react-native-timeline-flatlist';
import {useTranslation} from 'react-i18next';
import {
  Utensils,
  SmartphoneCharging,
  Workflow,
  Truck,
} from 'lucide-react-native';

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

const ReportDetailsScreenActivitiesData = () => {
  const {t} = useTranslation();
  const route = useRoute();
  const {id, date} = route.params;
  const {report, loading, error} = useReport(id);

  const getColor = (activity: string) => {
    if (activity === 'Break/Rest') {
      return '#758694';
    } else if (activity === 'Availability') {
      return '#059212';
    } else if (activity === 'Work') {
      return '#FABC3F';
    } else {
      return '#F5004F';
    }
  };

  function getIconForActivity(activity: string) {
    if (activity === 'Break/Rest') {
      return <Utensils size="24px" color="#fff" />;
    } else if (activity === 'Availability') {
      return <SmartphoneCharging size="24px" color="#fff" />;
    } else if (activity === 'Work') {
      return <Workflow size="24px" color="#fff" />;
    } else {
      return <Truck size="24px" color="#fff" />;
    }
  }

  const reportActivities =
    report.driver_activities?.find(activity => activity.date === date)
      .activity_changes || [];

  const cleanActivityArray = (data: any[]) => {
    const cleanedArray = [];
    let previousActivity = null;

    for (let i = 0; i < data.length; i++) {
      const current = data[i];

      if (previousActivity && previousActivity.activity === current.activity) {
        previousActivity.endTime = current.time_of_change;
      } else {
        if (previousActivity) {
          cleanedArray.push({
            time: previousActivity.startTime.split(':').slice(0, 2).join(':'),
            title: previousActivity.activity,
            icon: getIconForActivity(previousActivity.activity),
            circleColor: getColor(previousActivity.activity),
            circleSize: 40,
            description: `${t('Czas trwania')}: ${calculateDuration(
              previousActivity.startTime,
              current.time_of_change,
            )}`,
          });
        }

        previousActivity = {
          activity: current.activity,
          startTime: current.time_of_change,
          endTime: current.time_of_change,
        };
      }
    }

    if (previousActivity) {
      cleanedArray.push({
        time: previousActivity.startTime.split(':').slice(0, 2).join(':'),
        title: previousActivity.activity,
        description: '',
        icon: getIconForActivity(previousActivity.activity),
        circleColor: getColor(previousActivity.activity),
        position: 'right',
        circleSize: 36,
      });
    }

    cleanedArray.sort((a, b) => {
      const aTime = a.time.split(':').map(Number);
      const bTime = b.time.split(':').map(Number);

      if (aTime[0] < bTime[0]) {
        return -1;
      } else if (aTime[0] > bTime[0]) {
        return 1;
      } else {
        if (aTime[1] < bTime[1]) {
          return -1;
        } else if (aTime[1] > bTime[1]) {
          return 1;
        } else {
          return 0;
        }
      }
    });

    return cleanedArray;
  };

  function calculateDuration(startTime: string, endTime: string) {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    let durationMinutes =
      endHours * 60 + endMinutes - (startHours * 60 + startMinutes);
    if (durationMinutes < 0) {
      durationMinutes += 24 * 60;
    }

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return `${hours}h ${minutes}m`;
  }

  let reportCleaned = cleanActivityArray(reportActivities);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-darkPurple pt-6">
      <StyledView className="flex-1">
        <Heading title={moment(date).format('DD/MM/YYYY')} classes="mb-2" />
        {reportActivities.length === 0 || error ? (
          <NoContent elementName="aktywności" />
        ) : (
          <Timeline
            data={reportCleaned}
            innerCircle={'icon'}
            renderFullLine={true}
            lineColor="#fff"
            descriptionStyle={{
              color: '#F1F5F9',
              paddingTop: 5,
              paddingLeft: 10,
              paddingBottom: 30,
            }}
            listViewContainerStyle={{
              paddingTop: 40,
              paddingLeft: 25,
            }}
            titleStyle={{color: '#F1F5F9', paddingLeft: 10}}
            timeContainerStyle={{minWidth: 52, marginTop: 5, marginRight: 6}}
            timeStyle={{
              textAlign: 'center',
              backgroundColor: '#F1F5F9',
              color: '#5958b2',
              padding: 5,
              borderRadius: 13,
            }}
          />
        )}
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default ReportDetailsScreenActivitiesData;
