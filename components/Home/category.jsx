import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query } from 'firebase/firestore'
import { db } from '../../configs/FirebaseConfig'
import { FlatList } from 'react-native';
import CategoryItem from '../CategoryItem';

export default function category() {

    const[categoryList,setCategoryList]=useState([]);
    useEffect(()=>{
        GetcategoryList()
    },[])
    const GetcategoryList=async()=>{
        setCategoryList([])
        const q=query(collection(db,'Category'));
        const querySnapshot=await getDocs(q);

        querySnapshot.forEach((doc)=>{
            console.log(doc.data())
            setCategoryList(prev=>[...prev,doc.data()])
        })
    }
  return (
    <View>
      <Text
      style={{paddingLeft:20,
        marginTop:10,
        fontSize:20,
        fontFamily:'outfit-medium',
        display:'flex'
      }}
      
      >categories</Text>
      <FlatList
        data={categoryList}
        horizontal={true}
        renderItem={({item,index})=>(
            <CategoryItem category={item}
             key={index}
             onCategoryPress={(category)=>console.log(category)}
             />

        )}
           
      
      />
        
    </View>
  )
}