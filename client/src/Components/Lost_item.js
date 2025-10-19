import PhotoCamera from '@mui/icons-material/PhotoCamera';
import React, { useState } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  Paper,
  Grid,
  Button,
  Typography,
  Stack,
  TextField,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
  FormControl,
} from '@mui/material';
import { Formik, Form } from 'formik';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase.js';
import * as Yup from 'yup';

const LostItem = () => {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const getUserId = () => {
    const user = JSON.parse(window.localStorage.getItem('user'));
    return user ? user._id : null;
  };

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };

  const schema = Yup.object().shape({
    name: Yup.string().required('Item name is required'),
    description: Yup.string().required('Description is required'),
    type: Yup.string().required('Item type is required'),
    location: Yup.string().required('Location is required'),
    date: Yup.string().required('Date is required'),
    number: Yup.string().required('Phone number is required'),
  });

  const handleImageUpload = (e) => {
    setImage(e.target.files);
  };

  const handleSubmit = async (values) => {
    try {
      await schema.validate(values, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.inner.map((err) => err.message);
      toast.error(errorMessages.join('\n'), {
        position: "bottom-right",
        autoClose: 1000,
        theme: "light",
      });
      return;
    }

    if (!image || image.length === 0) {
      toast.error('Please upload at least one image', { position: "bottom-right", autoClose: 1000, theme: "light" });
      return;
    }

    setLoading(true);
    const promises = [];

    for (let i = 0; i < image.length; i++) {
      const img = image[i];
      const storageRef = ref(storage, `/images/${img.name}`);
      const uploadTask = uploadBytesResumable(storageRef, img);

      const promise = new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            const uploaded = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(uploaded);
          },
          (error) => reject(error),
          () => {
            getDownloadURL(uploadTask.snapshot.ref)
              .then(resolve)
              .catch(reject);
          }
        );
      });

      promises.push(promise);
    }

    Promise.all(promises)
      .then((urls) => {
        const newItem = { ...values, userId: getUserId(), img: urls };
        axios.post('http://localhost:5000/Items/newItem', newItem, config)
          .then(() => {
            toast.success('Wohoo 🤩! Item listed successfully.', { position: "bottom-right", autoClose: 1000, theme: "light" });
            setLoading(false);
            setShow(false);
            window.location.href = "/mylistings";
          })
          .catch((error) => {
            console.error(error);
            toast.error('Oops 🙁! Something went wrong.', { position: "bottom-right", autoClose: 1000, theme: "light" });
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Oops 🙁! Image upload failed.', { position: "bottom-right", autoClose: 1000, theme: "light" });
        setLoading(false);
      });
  };

  return (
    <Stack width="100%" pt="60px" alignItems="center">
      <Typography fontSize="30px" color="primary">
        If your item is lost or you found someone's item, Post it Here!
      </Typography>
      <Stack
        width="100%"
        maxWidth="1440px"
        direction="row"
        justifyContent={{ xs: 'center', md: 'space-evenly' }}
        alignItems="center"
      >
        <Formik
          initialValues={{
            name: '',
            description: '',
            type: '',
            location: '',
            date: '',
            number: '',
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
              <Paper variant="outlined" sx={{ my: { xs: 12, md: 6 }, p: { xs: 5, md: 5 } }}>
                <Form>
                  <Stack spacing={2}>
                    <Typography variant="h6">Picture</Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Button variant="contained" component="label" endIcon={<PhotoCamera />}>
                        Upload
                        <input hidden accept="image/*" multiple type="file" onChange={handleImageUpload} />
                      </Button>
                      {progress > 0 && <Typography>{progress}% uploaded</Typography>}
                    </Stack>

                    <Typography variant="h6">Item Details</Typography>
                    <TextField
                      required
                      label="Item name"
                      name="name"
                      size="small"
                      fullWidth
                      variant="standard"
                      value={values.name}
                      onChange={handleChange}
                    />
                    <TextField
                      required
                      label="Description"
                      name="description"
                      multiline
                      size="small"
                      fullWidth
                      variant="standard"
                      value={values.description}
                      onChange={handleChange}
                    />
                    <TextField
                      required
                      label="Location"
                      name="location"
                      size="small"
                      fullWidth
                      variant="standard"
                      value={values.location}
                      onChange={handleChange}
                    />
                    <TextField
                      required
                      label="Date"
                      name="date"
                      type="date"
                      size="small"
                      fullWidth
                      variant="standard"
                      value={values.date}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      required
                      label="Contact Number"
                      name="number"
                      size="small"
                      fullWidth
                      variant="standard"
                      value={values.number}
                      onChange={handleChange}
                    />

                    <FormControl variant="standard" sx={{ minWidth: 120 }}>
                      <InputLabel>Item Type</InputLabel>
                      <Select name="type" value={values.type} onChange={handleChange}>
                        <MenuItem value="Lost">Lost It</MenuItem>
                        <MenuItem value="Found">Found It</MenuItem>
                      </Select>
                      <FormHelperText>Please select the type of item</FormHelperText>
                    </FormControl>

                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? "Posting..." : "Create Post"}
                      </Button>
                    </motion.div>
                  </Stack>
                </Form>
              </Paper>
            </Container>
          )}
        </Formik>

        <motion.div
          whileHover={{ scale: [null, 1.05, 1.05] }}
          transition={{ duration: 0.4 }}
        >
          <Stack justifyContent="center" alignItems="center" width="100%" maxWidth="450px" sx={{ display: { xs: 'none', md: 'flex' } }}>
            <img width="100%" src="https://i.ibb.co/Q65DB0d/list-item.png" alt="Post Image" />
          </Stack>
        </motion.div>
      </Stack>
    </Stack>
  );
};

export default LostItem;
