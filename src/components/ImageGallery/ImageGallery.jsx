import Searchbar from 'components/Searchbar/Searchbar';
import React, { useEffect, useState } from 'react';
import { getImagesApi } from '../../api/api';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import Modal from 'components/Modal/Modal';
import css from './ImageGallery.module.css';
import PropTypes from 'prop-types';

const ImageGallery = () => {
  const [searchTextValue, setSearchTextValue] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [showBtn, setShowBtn] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { totalHits, hits } = await getImagesApi(searchTextValue, page);
        if (!searchTextValue) {
          setShowBtn(false);
          return;
        }
        setImages(prevImages => [...prevImages, ...hits]);
        setShowBtn(page < Math.ceil(totalHits / 12));
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoader(false);
      }
    };

    setLoader(true);
    fetchImages();
  }, [searchTextValue, page]);

  const handleSubmit = searchText => {
    setSearchTextValue(searchText);
    setPage(1);
    setImages([]);
    setShowBtn(false);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleLargeImageURLClick = ({ tags, largeImageURL }) => {
    setSelectedImage({ tags, largeImageURL });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Searchbar handleSubmit={handleSubmit} />

      {images.length > 0 && (
        <ul className={css.gallery}>
          {images.map(({ id, webformatURL, tags, largeImageURL }) => (
            <ImageGalleryItem
              key={id}
              webformatURL={webformatURL}
              tags={tags}
              onClick={() => handleLargeImageURLClick({ tags, largeImageURL })}
            />
          ))}
        </ul>
      )}
      {loader && <Loader />}
      {showBtn && <Button onClick={handleLoadMore} />}
      {selectedImage && (
        <Modal
          largeImageURL={selectedImage.largeImageURL}
          tags={selectedImage.tags}
          onClose={closeModal}
        />
      )}
    </>
  );
};

ImageGallery.propTypes = {
  searchTextValue: PropTypes.string,
  page: PropTypes.number,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      webformatURL: PropTypes.string.isRequired,
      tags: PropTypes.string.isRequired,
      largeImageURL: PropTypes.string.isRequired,
    })
  ),
  showBtn: PropTypes.bool,
  loader: PropTypes.bool,
  selectedImage: PropTypes.shape({
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }),
  handleSubmit: PropTypes.func,
  handleLoadMore: PropTypes.func,
  handleLargeImageURLClick: PropTypes.func,
  closeModal: PropTypes.func,
};

export default ImageGallery;
