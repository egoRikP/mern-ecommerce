import {Modal, notification} from 'antd';

export const useMessage = () => {

  const successMessage = (text, icon) => {
    notification.destroy();
    notification.open({
      type: 'success',
      message: text,
      icon: icon || null,
    })
  };

  const errorMessage = (text,icon) => {
    notification.destroy();
    notification.open({
      type: 'error',
      message: text,
      icon: icon || null,
    })
  };

  return {successMessage, errorMessage};

}