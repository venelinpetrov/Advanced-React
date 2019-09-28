import { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import FormatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!,
        $description: String!,
        $price: Int!,
        $image: String,
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0,
        previewLoading: false
    }
    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }
    uploadFile = async e => {
        this.setState({ previewLoading: true })
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/dnaaiid3i/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await res.json();

        this.setState({ previewLoading: false });
        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }
    render() {
        return (
            <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
                {(createItem, {error, loading}) => (
                    <Form onSubmit={async e => {
                        e.preventDefault();
                        const res = await createItem();
                        console.log(res);
                        Router.push({
                            pathname: '/item',
                            query: { id: res.data.createItem.id }
                        })
                    }}>
                        <h2>Sell an item</h2>
                        <Error error={error}/>
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor="file">
                                Upload
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    placeholder="file"
                                    onChange={this.uploadFile}
                                    required />
                                    {this.state.image && <img src={this.state.image} alt="Upload image" width="200"/>}
                            </label>
                            <label htmlFor="title">
                                Title
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Title"
                                    value={this.state.title}
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
                                    value={this.state.description}
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
                                    value={this.state.price}
                                    onChange={this.handleChange}
                                    required />
                            </label>
                        </fieldset>
                        <button type="submit" disabled={this.state.previewLoading}>Submit</button>
                    </Form>
                )}
            </Mutation>
        )
    }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION }