import { Searchbar } from 'components/Searchbar/Searchbar';
import React, { Component } from 'react';
import { getImagesApi } from '../../api/api';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import css from './ImageGallery.module.css';

export class ImageGallery extends Component {
  state = {
    searchTextValue: 'dog',
    page: 1,
    images: [],
    showBtn: false,
    loader: false,
    selectedImage: null,
  };

  componentDidUpdate(_, prevState) {
    const { searchTextValue, page } = this.state;
    if (
      prevState.searchTextValue !== searchTextValue ||
      prevState.page !== page
    ) {
      this.setState({ loader: true }, () => {
        this.fetchImages().finally(() => {
          this.setState({ loader: false });
        });
      });
    }
  }

  fetchImages = async () => {
    const { searchTextValue, page } = this.state;
    try {
      const { totalHits, hits } = await getImagesApi(searchTextValue, page);
      if (!searchTextValue) {
        this.setState({ showBtn: false });
        return;
      }
      this.setState({
        images: [...this.state.images, ...hits],
        showBtn: page < Math.ceil(totalHits / 12),
      });
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  handleSubmit = searchText => {
    this.setState({
      searchTextValue: searchText,
      page: 1,
      images: [],
      showBtn: false,
    });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  handleLargeImageURLClick = ({ tags, largeImageURL }) => {
    this.setState({ selectedImage: { tags, largeImageURL } });
  };

  closeModal = () => {
    this.setState({ selectedImage: null });
  };

  render() {
    const { images, showBtn, loader, selectedImage } = this.state;
    return (
      <>
        <Searchbar handleSubmit={this.handleSubmit} />

        {images.length > 0 && (
          <ul className={css.gallery}>
            {images.map(({ id, webformatURL, tags, largeImageURL }) => (
              <ImageGalleryItem
                key={id}
                webformatURL={webformatURL}
                tags={tags}
                onClick={() =>
                  this.handleLargeImageURLClick({
                    tags,
                    largeImageURL,
                  })
                }
              />
            ))}
          </ul>
        )}
        {loader && <Loader />}
        {showBtn && <Button onClick={this.handleLoadMore} />}
        {selectedImage && (
          <Modal
            largeImageURL={selectedImage.largeImageURL}
            tags={selectedImage.tags}
            onClose={this.closeModal}
          />
        )}
      </>
    );
  }
}
