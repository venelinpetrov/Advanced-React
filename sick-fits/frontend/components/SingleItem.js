import { Query } from 'react-apollo';
import Head from 'next/head';
import gql from 'graphql-tag';
import styled from 'styled-components';
import ErrorMessage from '../components/ErrorMessage';

const SingleItemStyles = styled.div`
    max-width: 1200px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    min-height: 800px;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .details {
        margin: 3rem;
        font-style: 2rem;
    }
`;

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            largeImage
        }
    }
`;

const SingleItem = props => {
    return (

        <Query query={SINGLE_ITEM_QUERY} variables={{ id: props.id }}>
            {
                ({ error, loading, data }) => {
                    if (error) return <ErrorMessage error={error} />
                    if (loading) return <p>Loading...</p>
                    if (data) {
                        const { item } = data;
                        return (
                            <SingleItemStyles>
                                <Head>
                                    <title>Sick Fits | {item.title}</title>
                                </Head>
                                <img src={item.largeImage} />
                                <div className="details">
                                    <h2>{item.title}</h2>
                                    <p>{item.description}</p>
                                </div>
                            </SingleItemStyles>
                        )
                    }
                    else return <p>No such item found</p>
                }
            }
        </Query>
    );
};

export default SingleItem;