import { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';
import Pagination from './Pagination';
import { perPage } from '../config';

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
    query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        items(skip: $skip, first: $first, orderBy: createdAt_DESC) {
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
                <Pagination page={this.props.page}/>
                <Query query={ALL_ITEMS_QUERY} variables={{
                    skip: this.props.page * perPage - perPage
                }}>
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
                <Pagination page={this.props.page}/>
            </Center>
        )
    }
}

export { ALL_ITEMS_QUERY };
