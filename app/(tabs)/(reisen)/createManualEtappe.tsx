import React, {useState, useEffect}from "react";
import { Text, Layout, Card, Button } from "@ui-kitten/components";
import ButtonGroup from "../../../components/Etappe/ButtonGroup";
import CoordinateInput from "../../../components/Etappe/CoordinateInput"
import { StyleSheet } from 'react-native';
import CardComponent from "../../../components/Etappe/CardComponent"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation, useRouter } from "expo-router";
import { Input } from '@ui-kitten/components';

const createManualEtappe: React.FC = () => {
 const navigation= useNavigation(); ///changing the title of the page
 const [titleBeingChanged, setTitleBeingChanged] = useState(false)  //// switches title from plain text to the input field
 const [etappeTitle, setEtappeTitle] = useState("Etappe"); ///the name of the title
 const router = useRouter();
 ////////////compass input variant
 const [startLat, setStartLat]   = useState("");
 const [startLon, setStartLon]   = useState("");
 const [startDate, setStartDate] = useState(new Date());
 
 const [endLat, setEndLat]   = useState("");
 const [endLon, setEndLon]   = useState("");
 const [endDate, setEndDate] = useState(new Date());

 ////////////address input variant
    
    
    
 ////////////on the map input variant


    // Title input field
    const titleInput = (
    <Layout   style={styles.headerInput}>
        <Input
            value={etappeTitle}
            onChangeText={(nextValue) => setEtappeTitle(nextValue)} // Update title
            maxLength={20} // Restrict input to 20 characters
        />

    </Layout>

    );

    // Button to toggle editing
    const changingTitleButton = (
        <Button
            appearance="ghost"
            onPress={() => setTitleBeingChanged((prevState) => !prevState)} // Toggle edit mode
        >
            {titleBeingChanged ? (
                <FontAwesomeIcon icon="check" size={25} /> // Accept changes
            ) : (
                <FontAwesomeIcon icon="edit" size={25} /> // Edit title
            )}
        </Button>
    );

    // Update header options whenever the title or edit state changes
    useEffect(() => {
        navigation.setOptions({
            headerTitle: () => (titleBeingChanged ? titleInput : <Text category="h4" status="primary">{etappeTitle}</Text>), // Switch between input and title
            headerRight: () => changingTitleButton, // Set the button on the right
            headerTitleAlign: "center", // Keep the title centered
        });
    }, [navigation, titleBeingChanged, etappeTitle]);

    ////coordinate start input
    const startCoordInput = <CoordinateInput lat={startLat} lon={startLon} setLat={setStartLat} setLon={setStartLon} date={startDate} setDate={setStartDate}/>
    ////coordinate start input
    const endCoordInput = <CoordinateInput lat={endLat} lon={endLon} setLat={setEndLat} setLon={setEndLon} date={endDate} setDate={setEndDate}/>


    const onSubmitEtappe=()=>{


    }
   



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
                <CardComponent title="Start" form={startCoordInput}/>

                <CardComponent title="Ende" form={endCoordInput}/>

            </Layout>
            <ButtonGroup>
                <Button style={styles.button} onPress={()=>{router.back()}}>
                    <Text category="h1">abbrechen</Text>
                </Button>
                <Button style={styles.button}  onPress={()=>{onSubmitEtappe}}>
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
    },
    headerInput: {
        justifyContent: "space-around",
        alignItems: 'center',
    }
});
