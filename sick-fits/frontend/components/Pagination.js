import { Query } from 'react-apollo'
import gql from 'graphql-tag';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const Pagination = props => (
    <Query query={PAGINATION_QUERY}>
        {({error, loading, data}) => {
            const itemsCount = data.itemsConnection.aggregate.count;
            const pagesCount = Math.ceil(itemsCount / perPage);
            const page = props.page;
            return  (
                <PaginationStyles>
                    <Link prefetch href={{
                        pathname: '/items',
                        query: { page: page - 1 }
                    }}>
                        <a className="prev" aria-disabled={page <= 1}>Prev</a>
                    </Link>
                    <div>You are on page {page} of {pagesCount}</div>
                    <Link prefetch href={{
                        pathname: '/items',
                        query: { page: page + 1 }
                    }}>
                        <a className="next" aria-disabled={page >= pagesCount}>Next</a>
                    </Link>
                </PaginationStyles>
            )
        }}
    </Query>
);

export default Pagination;