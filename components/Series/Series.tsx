import React from "react";
import {FlatList} from "react-native";
import PlaceholderImage from "../../assets/images/img_6.png";
import {router} from "expo-router";
import SeriesEpisode from "./SeriesEpisode";
import SeriesHeader from "./SeriesHeader";

// Placeholder data for episodes
const series = [
    {id: '1', title: 'Episode 1: Introduction', description: 'An introduction to the fall of Spain.'},
    {
        id: '2',
        title: 'Episode 2: The Golden Age',
        description: 'Exploring the golden age of Andalus and its cultural and scientific achievements.'
    },
    {
        id: '3',
        title: 'Episode 3: The Reconquista',
        description: 'The complex history of the Christian reconquest of the Iberian Peninsula.'
    },
    {
        id: '4',
        title: 'Episode 4: Granada’s Last Stand',
        description: 'The fall of Granada in 1492 marked the end of Muslim rule in Spain.'
    },
    {
        id: '5',
        title: 'Episode 5: The Spanish Inquisition',
        description: 'Understanding the motives and impacts of the Spanish Inquisition on society.'
    },
    {
        id: '6',
        title: 'Episode 6: The Moriscos',
        description: 'The forced conversions and eventual expulsion of the Moriscos from Spain.'
    },
    {
        id: '7',
        title: 'Episode 7: Cultural Fusion',
        description: 'How Islamic, Christian, and Jewish cultures coexisted and influenced each other.'
    },
    {
        id: '8',
        title: 'Episode 8: Architecture and Art',
        description: 'The lasting influence of Islamic architecture and art in Spain.'
    },
    {
        id: '9',
        title: 'Episode 9: The Age of Discovery',
        description: 'How Spain’s conquests influenced global exploration and trade.'
    },
    {
        id: '10',
        title: 'Episode 10: Literature of Al-Andalus',
        description: 'Exploring the rich literary contributions of Muslim Spain.'
    },
    {
        id: '11',
        title: 'Episode 11: The Legacy of Al-Andalus',
        description: 'The historical and modern significance of Al-Andalus.'
    },
    {
        id: '12',
        title: 'Episode 12: Reflections and Lessons',
        description: 'What can the history of Islamic Spain teach us about tolerance and cultural exchange today?'
    },
];


export default function () {
    const ListHeader = () => (
        <SeriesHeader
            title={'The Fall Of Spain'}
            description={'The fall of Spain, formerly known as Andalus. Sheikh Sa\'eed Ali illustrates the striking similarity between the conditions that existed some 500 years ago, which led to the fast decline of Islam in Spain and the conditions that exist now in all Islamic countries.'}
            image={PlaceholderImage}
            play={() => {}}
        />
    );

    const openEpisode = () => router.push('episode')

    const renderEpisodeItem = ({item}) => (
        <SeriesEpisode title={item.title} description={item.description} openEpisode={openEpisode}/>
    );

    return (
        <FlatList
            ListHeaderComponent={ListHeader}
            data={series}
            renderItem={renderEpisodeItem}
            keyExtractor={item => item.id}
        />
    );
};