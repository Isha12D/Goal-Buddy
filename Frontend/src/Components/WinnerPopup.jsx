import React from 'react';
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';

const WinnerPopup = ({ open, onClose, message }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-center font-bold text-lg">Notification</DialogTitle>
      <DialogContent className="flex flex-col items-center text-center space-y-4">
        <p className="text-gray-800 text-md">{message}</p>
        <Button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerPopup;
