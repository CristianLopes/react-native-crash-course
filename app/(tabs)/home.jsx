import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getAllPosts, getLatestPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
const Home = () => {
  const { user } = useGlobalContext();
  const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = async () => {
    setIsRefreshing(true);

    await refetch();

    setIsRefreshing(false);
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='justify-between items-start flex-row mb-6'>
              <View>
                <Text className='font-pmedium text-sm text-gray-100'>
                  Welcome Back
                </Text>
                <Text className='text-2xl font-psemibold text-white'>
                  {user && user.username}
                </Text>
              </View>

              <View className='mt-1.5'>
                <Image
                  resizeMode='contain'
                  source={images.logoSmall}
                  className='w-9 h-10'
                />
              </View>
            </View>

            <SearchInput />

            {latestPosts && (
              <View className='w-full flex-1 pt-5 pb-8'>
                <Text className='text-gray-100 text-lg font-pregular mb-3'>
                  Latest Videos
                </Text>

                <Trending posts={latestPosts} />
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title='No Videos Found'
            subtitle='No videos created yet'
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
      ></FlatList>
    </SafeAreaView>
  );
};

export default Home;
