import React from 'react';

//import { LoginContext } from '../../context/Login'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { SearchContext } from '@/context/SearchContext';

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
  const { setSearchTerm } = React.useContext(SearchContext);
  const [slide, setSlide] = React.useState(0);
  const products: any[] = [
    {
      id: '1',
      name: 'test',
      price: 10,
      rating: 5,
      image: 'https://i.imgur.com/bJfWk7N.png',
      keyword: 'dinnerware'
    },
    {
      id: '2',
      name: 'test2',
      price: 20,
      rating: 4,
      image: 'https://i.imgur.com/JQSm0SU.png',
      keyword: 'plush'
    },
    {
      id: '3',
      name: 'test3',
      price: 30,
      rating: 3,
      image: 'https://i.imgur.com/xS31ASr.png',
      keyword: 'laptop'
    }, 
    {
      id: '4',
      name: 'test4',
      price: 40,
      rating: 2,
      image: 'https://i.imgur.com/hzvxmho.png',
      keyword: 'chair'
    }
  ];

  // console.log(error);

  const nextSlide = () => {
    setSlide((slide + 1) % products.length);
  };
  const prevSlide = () => {
    setSlide(slide === 0 ? products.length - 1 : slide - 1);
  };

  const handleImageClick = (keyword: string) => {
    setSearchTerm(keyword);
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
            objectPosition: 'top',
            cursor: 'pointer'
          }} 
          onClick={() => handleImageClick(product.keyword)}
        />
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