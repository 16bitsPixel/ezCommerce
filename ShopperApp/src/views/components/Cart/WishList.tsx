/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import {List, Typography, Box, CardContent} from '@mui/material';
import { Product } from '../../../graphql/product/schema'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { LoginContext } from '../../../context/Login';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

interface fetchWishList {
  setWishlist: any;
  loginContext: any;
}

// TODO: FIX ADD SO DONT ADD MULTIPLE WISHLIST
const fetchWishlist = ({ setWishlist, loginContext }: fetchWishList) => {
  const query = {
    query: `query getWishList {
        getWishList {
        Productid
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginContext.accessToken}`
    },
  })
    .then((res) => res.json())
    .then((json) => {
      setWishlist(json.data.getWishList);
    })
    .catch((e) => {
      alert(e.toString());
      setWishlist(undefined);
    });
};

interface FetchProductParams {
  id: string|string[]|undefined;
  setProduct: React.Dispatch<React.SetStateAction<Product|undefined>>;
}

const fetchProduct = ({ id, setProduct }: FetchProductParams) => {
  const query = {
    query: `query GetProduct {
      productInfo(productId: "${id}") {
        id, name, description, price, rating, image
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((json) => {
      setProduct(json.data.productInfo);
    });
};

/*
interface DeleteCartItemParams {
  newCart: CartItem[];
  loginContext: any;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

TODO: DELETE WISHLIST ITEM
const deleteCartItem = ({ newCart, loginContext, setError }: DeleteCartItemParams) => {
  const query = {
    query: `mutation DeleteCartItem {
      setCart(newCart: ${JSON.stringify(newCart)}) {
        id, quantity
      }
    }`
  };

  fetch('/api/graphql', {
    method: 'POST',
    body: JSON.stringify(query),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loginContext.accessToken}`
    },
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.errors) {
        setError(json.errors[0].message);
      } else {
        setError('');
      }
    })
    .catch((e) => {
      setError(e.toString());
    });
};
*/

/**
 * Workspace drawer
 * @return {JSX}
 */
export function WishList() {
  const [wishlist, setWishlist] = React.useState<any[]>([]);
  const [wishlistProducts, setWishlistProducts] = React.useState<Product[]>([]);
  const loginContext = React.useContext(LoginContext)
  const router = useRouter();
  const { t } = useTranslation('common');

  React.useEffect(() => {
    if (loginContext.accessToken.length > 1) {
      fetchWishlist({setWishlist, loginContext});
    }
  }, []); // eslint-disable-line

  React.useEffect(() => {
    const loadProducts = async () => {
      const productPromises = wishlist.map((product: any) =>
        new Promise((resolve) => {
          fetchProduct({
            id: product.Productid,
            setProduct: (product) => resolve(product),
          });
        })
      );

      const productResults = await Promise.all(productPromises);
      setWishlistProducts(productResults.filter((product): product is Product => product !== undefined));
    };

    loadProducts();
  }, [wishlist]); // eslint-disable-line

  /*
  const handleDeleteItem = (index: number) => {
    // Create a copy of the cart
    const updatedList = [...wishlist];

    console.log("updated Cart: ", updatedList)
    // Remove the item at the specified index
    updatedList.splice(index, 1);
    console.log("update after the delete: ", updatedList)
    setCart(updatedList);
    if (loginContext.accessToken.length < 1) {
      // if not logged in
      localStorage.setItem('cart', JSON.stringify(updatedList));
    } else {
      // if logged in then set cart endpoint
      deleteCartItem({newCart: updatedList, loginContext, setError});
    }
  };
  */

  const handleClick = (id: string) => {
    router.push(`/product?id=${id}`);
  }

  // TODO: FIX IMAGE SIZING AND GRID SIZING
  return (
    <Box style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
      <List>
        {wishlistProducts.map((item: Product, index) => (
          <Card key={index} style={{ display: 'flex', marginBottom: '16px', padding: '16px', alignItems: 'center', minHeight: '15vh' }}>
            <Grid container spacing={2}>
              <Grid item xs={3} sm={3} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CardMedia
                  component="img"
                  image={item.image[0]}
                  alt={item.name}
                  aria-label={`cardImage-${index}`}
                  style={{ height: 'auto', maxWidth: '100%', maxHeight: '150px', objectFit: 'contain', cursor: 'pointer' }}
                  onClick={() => handleClick(item.id)}
                />
              </Grid>
              <Grid item xs={6} sm={7} md={8}>
                <CardContent>
                  <Typography variant="h6" component="a" style={{ color: 'black' }}>
                    {item.name}
                  </Typography>

                  {/* TODO: change based on quantity */}
                  <Typography variant="body2" color="green">{t("inStock")}</Typography>
                </CardContent>
              </Grid>

              <Grid item xs={2} sm={2} md={2} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', padding: 10 }}>
                <Typography variant="h6" style = {{fontWeight: 'bold'}}>${item.price}</Typography>
              </Grid>
            </Grid>
          </Card>
        ))}
      </List>
    </Box>
  );
}