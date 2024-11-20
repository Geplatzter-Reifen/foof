import React from "react";
import { Text, Layout, Card, Button } from "@ui-kitten/components";
import ButtonGroup from "../../../components/Etappe/ButtonGroup"
import { StyleSheet } from 'react-native';
import CardComponent from "../../../components/Etappe/CardComponent"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const createManualEtappe: React.FC = () => {
    return <Layout style={ styles.layout} level="3">
            <ButtonGroup>
                <Button style={styles.button} onPress={()=>{}}>

                        <FontAwesomeIcon icon="compass" size={25} />

                </Button>
                <Button style={styles.button} onPress={()=>{}}>

                        <FontAwesomeIcon icon="map-pin" size={25} />

                </Button>
                <Button style={styles.button} onPress={()=>{}}>
                    <FontAwesomeIcon icon="city" size={25} />
                </Button>
            </ButtonGroup>

            <Layout style={ styles.cardsContainer} level="3">
                <CardComponent title="Start" form={<Text>djbhwefbdewe</Text>}/>

                <CardComponent title="Ende" form={<Text>djbhwefbdewe</Text>}/>

            </Layout>
            <ButtonGroup>
                <Button style={styles.button} >
                    <Text category="h1">abbrechen</Text>
                </Button>
                <Button style={styles.button} >
                    <Text category="h1">erstellen</Text>
                </Button>
            </ButtonGroup>
    </Layout>;
};

export default createManualEtappe;


const styles = StyleSheet.create({
    cardsContainer: {
        flex: 7, // Takes up the majority of the remaining space
        flexDirection: 'column', // Arrange cards in a column
        justifyContent: 'space-around', // Space cards evenly
        alignItems: 'center', // Center cards horizontally

    },
    layout: {
        flex: 1,
        alignItems: 'stretch',
        paddingVertical:5

    },
    button:{
        flex:1,
        flexDirection:"row",
        justifyContent: "center",
        alignItems:"center",
        margin:5,
        alignSelf:"center",
    }
});
