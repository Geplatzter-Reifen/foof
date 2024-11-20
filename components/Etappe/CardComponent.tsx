import React from 'react';

import {Card, Text, Layout }from "@ui-kitten/components";
import { StyleSheet } from 'react-native';

interface cardProps{
    form:React.ReactElement,
    title:string
    
}

const cardHeder = ({ title }: { title: string }): React.ReactElement => {
    return <Text style={{textAlign:"center"}} category="h4">{title}</Text>
}
    
function CardComponent(props:cardProps) {
    const {form, title}= props
    return (
        <Layout style={style.flexContainer} level="3">
            <Card  style={style.card} header={() => cardHeder({ title })}>
                {form}
            </Card>
        </Layout>

    );
}

export default CardComponent;


const style = StyleSheet.create({
    card:{
        flex: 1, // Allow the element to grow
        borderRadius: 8,
        borderWidth: 0,
    },
    flexContainer:{
        flex:1,
        flexDirection:"row",
        marginVertical:5,
        marginHorizontal:10
    }
})

