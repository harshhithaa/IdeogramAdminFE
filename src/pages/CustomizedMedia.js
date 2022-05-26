import React from 'react';
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
import FileSaver from 'file-saver';

const CustomizedMedia = () => {
  return (
    <ImageEditor
      includeUI={{
        loadImage: {
          path: 'img/sampleImage.jpg',
          name: 'SampleImage'
        },
        menu: ['text'],
        initMenu: 'text',
        uiSize: {
          width: '1000px',
          height: '600px'
        },
        menuBarPosition: 'bottom'
      }}
      cssMaxHeight={500}
      cssMaxWidth={700}
      selectionStyle={{
        cornerSize: 20,
        rotatingPointOffset: 70
      }}
      usageStatistics={true}
    />
  );
};

export default CustomizedMedia;
