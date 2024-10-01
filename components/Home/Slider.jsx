import { View, Text, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from './../../configs/FirebaseConfig';

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliderList();
  }, []);

  const GetSliderList = async () => {
    setSliderList([]);
    const q = query(collection(db, 'Slider'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      setSliderList((prev) => [...prev, doc.data()]);
    });
  };

  return (
    <View>
      <FlatList
        data={sliderList}
        horizontal={true}
        style={{paddingLeft:20,
          marginTop:20
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }}  // Using the correct imageUrl from Firestore
            style={{ 
                width: 300, 
                height: 160,
                borderRadius:15,
                marginRight:20
             }}
          />
        )}
      />
    </View>
  );
}
