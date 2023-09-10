import { useState, useEffect } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { Modal } from './Modal/Modal';
import { getImages } from './GetImages';

export const App = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [queryState, setQueryState] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreImages, setHasMoreImages] = useState(false);

  useEffect(() => {
    setImages([]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (queryState !== '') {
        setIsLoading(true);
        try {
          const images = await getImages(queryState, page);
          if (images.length > 0) {
            setHasMoreImages(true);
          }
          if (images.length < 12) {
            setHasMoreImages(false);
          }
          const processedImages = images.map(image => ({
            id: image.id,
            webformatURL: image.webformatURL,
            largeImageURL: image.largeImageURL,
          }));
          setImages(prevImages => [...prevImages, ...processedImages]);
        } catch (error) {
          console.log('Error.Please reload page');
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [queryState, page]);

  const handleSearch = query => {
    setPage(1);
    setImages([]);
    setQueryState(query);
  };

  const loadMoreImages = async () => {
    setPage(page + 1);
  };
  const handleEscKeyPress = e => {
    if (e.key === 'Escape' && isModalOpen === false) {
      closeModal();
    }
  };

  const openModal = imageUrl => {
    document.addEventListener('keydown', handleEscKeyPress);
    setIsModalOpen(true);
    setSelectedImageUrl(imageUrl);
  };

  const closeModal = () => {
    document.removeEventListener('keydown', handleEscKeyPress);

    setIsModalOpen(false);
    setSelectedImageUrl('');
  };
 

  return (
    <div>
      <Searchbar onSubmit={handleSearch} />

      {isLoading ? (
        <Loader />
      ) : (
        <ImageGallery data={images} openModal={openModal} />
      )}
      {hasMoreImages ? <Button onClick={loadMoreImages} /> : null}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageUrl={selectedImageUrl}
      />
    </div>
  );
};
