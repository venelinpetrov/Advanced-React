import { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import FormatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;
const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`;

class UpdateItem extends Component {
    state = {}

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    updateItem = async (e, updateItemMutation) => {
        e.preventDefault();

        const res = await updateItemMutation({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
    }

    render() {
        return (
            <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
                {({ data, loading }) => {
                    if (loading) return <p>Loading...</p>
                    if (!data.item) return <p>No item found with id {this.props.id}</p>
                    return (
                        <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                            {(updateItem, { error, loading }) => (
                                <Form onSubmit={async e => {
                                    this.updateItem(e, updateItem);
                                }}>
                                    <h2>Sell an item</h2>
                                    <Error error={error} />
                                    <fieldset disabled={loading} aria-busy={loading}>
                                        <label htmlFor="title">
                                            Title
                                            <input
                                                type="text"
                                                id="title"
                                                name="title"
                                                placeholder="Title"
                                                defaultValue={data.item.title}
                                                onChange={this.handleChange}
                                                required />
                                        </label>
                                        <label htmlFor="description">
                                            Description
                                            <textarea
                                                type="text"
                                                id="description"
                                                name="description"
                                                placeholder="Description"
                                                defaultValue={data.item.description}
                                                onChange={this.handleChange}
                                                required />
                                        </label>
                                        <label htmlFor="price">
                                            Price
                                            <input
                                                type="number"
                                                id="price"
                                                name="price"
                                                min="0"
                                                placeholder="0"
                                                defaultValue={data.item.price}
                                                onChange={this.handleChange}
                                                required />
                                        </label>
                                    </fieldset>
                                    <button type="submit">Save changes</button>
                                </Form>
                            )}
                        </Mutation>
                    )
                }}
            </Query>
        )
    }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION as CREATE_ITEM_MUTATION }