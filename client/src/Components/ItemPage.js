import React, { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ContactsIcon from '@mui/icons-material/Contacts';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import axios from "axios";
import {
  Modal,
  Button,
  Typography,
  Avatar,
  Stack,
} from '@mui/material';
import { Carousel } from 'react-carousel-minimal';
import { MdDateRange } from 'react-icons/md';
import { GrMap } from 'react-icons/gr';
import { setConstraint } from "../constraints";

function ItemPage() {
  const [item, setItem] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);
  const handleCloseContact = () => setShowContact(false);
  const handleShowContact = () => setShowContact(true);

  setConstraint(true);

  const queryParams = new URLSearchParams(window.location.search);
  const item_id = queryParams.get('cid');
  const current_user = queryParams.get('type').split("/")[1];

  useEffect(() => {
    axios({
      url: `http://localhost:5000/Items/${item_id}`,
      method: "GET",
    })
      .then((response) => {
        const data = response.data.item;

        let slides = [];
        data.img.forEach((img) => slides.push({ image: img }));
        setItem(data);

        let created_date = new Date(data.createdAt);
        let createdAt =
          created_date.getDate() +
          "/" +
          (created_date.getMonth() + 1) +
          "/" +
          created_date.getFullYear() +
          " " +
          created_date.getHours() +
          ":" +
          created_date.getMinutes();

        const itemDetails = (
          <>
            <Stack
              width="100%"
              px={{ xs: 2, sm: 5, md: 10 }}
              gap="30px"
              marginTop="20px"
            >
              {/* Top Section: Carousel + User Info + Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                width="100%"
                justifyContent="space-evenly"
                alignItems="center"
                gap={{ xs: '0px', sm: '15px' }}
              >
                {/* Carousel */}
                <Stack
                  width={{ xs: '100%', sm: '50%', md: '750px' }}
                  height="280px"
                  mt="10px"
                >
                  <Carousel
                    data={slides}
                    width={{ xs: '100%', sm: '50%', md: '750px' }}
                    height="270px"
                    radius="10px"
                    dots={false}
                    automatic={false}
                    slideBackgroundColor="#dbdbdb"
                    slideImageFit="contain"
                    thumbnails={false}
                    thumbnailWidth="100px"
                  />
                </Stack>

                {/* User Info + Buttons */}
                <Stack
                  justifyContent="center"
                  width={{ xs: '100%', sm: '50%', md: '400px' }}
                  p="15px"
                  sx={{
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '5px',
                  }}
                  gap="10px"
                >
                  {/* User Info */}
                  <Stack
                    direction="row"
                    width="100%"
                    border="solid 3px"
                    borderRadius="10px"
                    sx={{ borderColor: 'primary.main' }}
                    gap="10px"
                    alignItems="center"
                    justifyContent="center"
                    p="10px"
                  >
                    <Stack width={{ md: '40%', xs: '100%' }} alignItems="center">
                      <Avatar
                        src={data?.userId?.img}
                        sx={{
                          width: { xs: 80, sm: 95, md: 110 },
                          height: { xs: 80, sm: 95, md: 110 },
                        }}
                      />
                    </Stack>
                    <Stack width={{ md: '60%', xs: '100%' }}>
                      <Typography
                        fontSize={{ xs: '20px', sm: '25px' }}
                        component="div"
                        fontWeight={'bold'}
                        mx={{ xs: '0', md: 'auto' }}
                        color={'primary'}
                      >
                        {data?.userId?.fullname}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Buttons */}
                  {current_user === "true" ? (
                    <Button
                      startIcon={<DeleteIcon />}
                      variant="contained"
                      color={'primary'}
                      sx={{ textTransform: 'none', borderRadius: '8px' }}
                      onClick={handleShowDelete}
                    >
                      <motion.div whileHover={{ scale: [null, 1.05, 1.05] }} transition={{ duration: 0.4 }} whileTap={{ scale: 0.98 }}>
                        Delete Post
                      </motion.div>
                    </Button>
                  ) : (
                    <Button
                      startIcon={<ContactsIcon />}
                      variant="contained"
                      color={'primary'}
                      sx={{ textTransform: 'none', borderRadius: '8px' }}
                      onClick={handleShowContact}
                    >
                      <motion.div whileHover={{ scale: [null, 1.05, 1.05] }} transition={{ duration: 0.4 }} whileTap={{ scale: 0.98 }}>
                        Contact
                      </motion.div>
                    </Button>
                  )}
                </Stack>
              </Stack>

              {/* Description */}
              <Stack direction="row" width="100%">
                <Stack sx={{ overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                  <Typography fontSize="18px" component="div" m="0" fontWeight="bold">
                    Description:
                  </Typography>
                  <Typography fontSize="16px" component="div" m="0" sx={{ textIndent: '100px', textAlign: 'justify' }}>
                    {data.description}
                  </Typography>
                </Stack>
              </Stack>

              {/* Status Badge Below Item Name */}
              <Stack>
                <Typography
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: "12px",
                    backgroundColor:
                      data.status === "approved"
                        ? "#4caf50"
                        : data.status === "pending"
                        ? "#ff9800"
                        : data.status === "rejected"
                        ? "#f44336"
                        : "#9e9e9e",
                    color: "white",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {data.status?.charAt(0).toUpperCase() + data.status?.slice(1)}
                </Typography>
              </Stack>

            </Stack>

            {/* Date & Location Section */}
            <Stack width="100%" px={{ xs: 3, sm: 5, md: 10 }} gap="15px">
              <Stack width="100%" mt="30px">
                <Stack width="100%" height="3px" backgroundColor={'primary.main'} />

                <Stack direction="row" width="100%" height="60px" alignItems="center" gap="15px">
                  <Stack justifyContent="flex-end" direction="row" width="49%" gap="8px">
                    <MdDateRange fontSize="20px" />
                    <Typography fontSize="15px" component="div" m="0" fontWeight="bold">
                      Date Found:
                    </Typography>
                  </Stack>
                  <Stack width="3px" height="80%" backgroundColor={'primary.main'} />
                  <Stack justifyContent="flex-start" direction="row" width="49%">
                    <Typography fontSize="15px" component="div" m="0">
                      {data?.date}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack width="100%" height="3px" backgroundColor={'primary.main'} />
                <Stack direction="row" minHeight="60px" alignItems="center" gap="15px">
                  <Stack justifyContent="flex-end" direction="row" width="49%" gap="8px">
                    <GrMap fontSize="20px" />
                    <Typography fontSize="15px" component="div" m="0" fontWeight="bold">
                      Location Found:
                    </Typography>
                  </Stack>
                  <Stack width="3px" height="80%" backgroundColor={'primary.main'} />
                  <Stack py="15px" justifyContent="flex-start" direction="row" width="49%">
                    <Typography fontSize="15px" component="div" m="0">
                      {data?.location}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack width="100%" height="3px" backgroundColor={'primary.main'} />

                {/* More Details */}
                <Stack width="100%" direction="column" gap="12px" py="15px">
                  <Typography fontSize="18px" fontWeight="bold" sx={{ textDecoration: 'underline' }}>
                    More Details
                  </Typography>
                  <Typography fontSize="15px"><strong>Finder Nickname:</strong> {data?.userId?.nickname}</Typography>
                  <Typography fontSize="15px"><strong>Email:</strong> {data?.userId?.email}</Typography>
                  <Typography fontSize="15px"><strong>Phone Number:</strong> {data?.number}</Typography>
                  <Typography fontSize="15px"><strong>Posted On:</strong> {createdAt}</Typography>
                </Stack>

              </Stack>
            </Stack>
          </>
        );
        setItemDetails(itemDetails);
      })
      .catch((err) => console.log("Error :", err));
  }, []);

  const delete_item = () => {
    axios({
      url: `http://localhost:4000/items/delete/${item_id}`,
      method: "DELETE",
    })
      .then(() => {
        handleCloseDelete();
        toast.success('Item deleted successfully!', { position: "bottom-right", autoClose: 1000 });
        window.location.href = "/mylistings";
      })
      .catch((err) => console.log("Error" + err));
  };

  return (
    <>
      <Stack width="100%" alignItems="center" pt="10px">
        <Stack direction="row" width="100%" sx={{ backgroundColor: 'primary.main' }} height="125px" gap="4px" alignItems="center" justifyContent="center">
          <Stack spacing={0} position="relative" justifyContent="center" width="100%" maxWidth="1440px" height="125px" overflow="hidden" ml={{ xs: 3, sm: 5, md: 10 }}>
            <Typography fontSize={{ xs: '18px', sm: '22px', md: '25px' }} color="white">
              {`${item?.type} Item`}
            </Typography>
            <Typography fontSize={{ xs: '17px', sm: '21px', md: '23px' }} color="white" fontWeight="bold">
              {'Someone Found'} {item?.name}
            </Typography>
          </Stack>
        </Stack>

        <Stack sx={{ justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '1440px' }}>
          {itemDetails}
        </Stack>
      </Stack>

      {/* Delete Modal */}
      <Modal open={showDelete} onClose={handleCloseDelete}>
        <Stack alignItems="center" justifyContent="center" gap="20px" sx={{ borderRadius: '20px', backgroundColor: '#eff5ff', width: '410px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: 24, p: 6 }}>
          <Typography fontSize="18px" component="div" m="0" fontWeight="bold">Are you sure ?</Typography>
          <Stack direction="row" width="100%" justifyContent="space-evenly" alignItems="center" spacing={2}>
            <Button variant="contained" color={'primary'} sx={{ textTransform: 'none', borderRadius: '8px' }} onClick={delete_item}>
              <motion.div whileHover={{ scale: [null, 1.05, 1.05] }} transition={{ duration: 0.4 }} whileTap={{ scale: 0.98 }}>Yes</motion.div>
            </Button>
            <Button variant="contained" color={'primary'} sx={{ textTransform: 'none', borderRadius: '8px' }} onClick={handleCloseDelete}>
              <motion.div whileHover={{ scale: [null, 1.05, 1.05] }} transition={{ duration: 0.4 }} whileTap={{ scale: 0.98 }}>No</motion.div>
            </Button>
          </Stack>
        </Stack>
      </Modal>

      {/* Contact Modal */}
      <Modal open={showContact} onClose={handleCloseContact}>
        <Stack alignItems="center" justifyContent="center" gap="20px" sx={{ borderRadius: '20px', backgroundColor: '#eff5ff', width: '410px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', boxShadow: 24, p: 6 }}>
          <Typography fontSize="18px" component="div" m="0" fontWeight="bold">{item?.userId?.fullname}'s Contact:</Typography>
          <Stack spacing={1} alignItems="center">
            <Typography fontSize="16px">{item?.number}</Typography>
            <Typography fontSize="16px">{item?.userId?.email}</Typography>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
}

export default ItemPage;
