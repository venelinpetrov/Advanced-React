import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';

const Center = styled.div`
    text-align: center;
`;

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
`;

const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY {
        items {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;
export default class Items extends Component {
    render() {
        return (
            <Center>
                <Query query={ALL_ITEMS_QUERY}>
                    {({error, loading, data}) => {
                        if (error)
                            return <p>{error.message}</p>
                        if (loading)
                            return <p>Loading...</p>

                        return (
                            <ItemsList>
                                {data.items.map(item => <Item key={item.id} item={item}></Item>)}
                            </ItemsList>
                        );
                    }}
                </Query>
            </Center>
        )
    }
}

export { ALL_ITEMS_QUERY };
