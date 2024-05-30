import React from 'react';
import { SearchContext } from '@/context/SearchContext';
import { Product } from '../../graphql/product/schema'
import ProductCard from './ProductCard';
import Grid from '@mui/material/Grid';

interface FetchSearchResultsParams {
  searchTerm: string;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}


const fetchSearchResults = ({ searchTerm, setProducts, setError }: FetchSearchResultsParams) => {
  const query = {
    query: `query searchProducts($searchTerm: String!) {
      searchProducts(query: $searchTerm) {
        id, name, price, rating, image
      }
    }`,
    variables: {
      searchTerm,
    },
  };
  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json()
    })
    .then((json) => {
      setError('')
      setProducts(json.data.product)
    })
    .catch((e) => {
      setError(e.toString())
      setProducts([])
    })
};

export function SearchResult() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState('Logged Out')
  const { searchTerm } = React.useContext(SearchContext);

  console.log(error);

  React.useEffect(() => {
    fetchSearchResults({ searchTerm, setProducts, setError });
  }, [searchTerm]);

  if (searchTerm.length > 0) {
    return (
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {products.map((product: Product, index) => (
          <Grid item xs={2} sm={2} md={2} key={index}>
            <ProductCard key = {product.id} id={product.id} name={product.name} price={product.price} /*rating={product.rating}*/ image={product.image}/>
          </Grid>
        ))}
      </Grid>
    )
  }
  else {
    return null
  }
}
