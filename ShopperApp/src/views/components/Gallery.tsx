import React from 'react';

//import { LoginContext } from '../../context/Login'
import { Product } from '../../graphql/product/schema'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// interface FetchProductsParams {
//   setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
//   setError: React.Dispatch<React.SetStateAction<string>>;
//   accessToken: string;
// }

// const fetchProducts = ({ setProducts, setError, accessToken }: FetchProductsParams) => {
//   const query = {query: `query product {product {id, name, price, rating, image}}`}
//   fetch('/api/graphql', {
//     method: 'POST',
//     body: JSON.stringify(query),
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//       'Content-Type': 'application/json',
//     },
//   })
//     .then((res) => {
//       return res.json()
//     })
//     .then((json) => {
//       if (json.errors) {
//         setError(`${json.errors[0].message}`)
//         setProducts([])
//       } else {
//         setError('')
//         setProducts(json.data.product)
//       }
//     })
//     .catch((e) => {
//       setError(e.toString())
//       setProducts([])
//     })
// };

export function Gallery() {
  //const loginContext = React.useContext(LoginContext)
  // const [products, setProducts] = React.useState<Product[]>([]);
  // const [error, setError] = React.useState('Logged Out');
  const [slide, setSlide] = React.useState(0);
  const products: any[] = [
    {
      id: '1',
      name: 'test',
      price: 10,
      rating: 5,
      image: 'https://m.media-amazon.com/images/I/713cCZD1LVL._SX3000_.jpg'
    },
    {
      id: '2',
      name: 'test2',
      price: 20,
      rating: 4,
      image: 'https://m.media-amazon.com/images/I/71pWRle5T-L._SX3000_.jpg'
    },
    {
      id: '3',
      name: 'test3',
      price: 30,
      rating: 3,
      image: 'https://m.media-amazon.com/images/I/71hVxSEbQjL._SX3000_.jpg'
    }
  ];

  // console.log(error);

  const nextSlide = () => {
    setSlide((slide + 1) % products.length);
  };
  const prevSlide = () => {
    setSlide(slide === 0 ? products.length - 1 : slide - 1);
  };

  // React.useEffect(() => {
  //   fetchProducts({setProducts, setError, accessToken: loginContext.accessToken});
  // }, [loginContext.accessToken]);

  return (
    <div className='Gallery'>
      <ArrowBackIosIcon className ='arrow arrow-left'
        aria-label='arrow-left'
        onClick={prevSlide} />
      {products.map((product: any, idx) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key = {product.id} 
          alt= {product.name} 
          src={product.image}
          data-testid = {product.id} 
          className={slide === idx ? 'slide' : 'slide slide-hidden'}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '300px',
            objectFit: 'cover',
            objectPosition: 'top'
          }} />
      ))}
      <ArrowForwardIosIcon className='arrow arrow-right'
        onClick={nextSlide}
        aria-label='arrow-right' />
      <span className = 'indicators'>
        {products.map((_, idx) => {
          return <button 
            key={idx} 
            onClick={() => {setSlide(idx)}} 
            className={slide === idx ? 'indicator' : 'indicator indicator-inactive'}
            data-testid={`indicator-${idx}`} />
        })}
      </span>
    </div>
  )
}