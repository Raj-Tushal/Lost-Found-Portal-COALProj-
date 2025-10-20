import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import { FcAbout, FcOvertime } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import { setConstraint } from "../constraints";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Pagination,
} from '@mui/material';
import Axios from "axios";

const Paginationn = ({ page, setPage, max }) => {
  const handleChange = (event, page) => setPage(page);

  return (
    <Pagination
      sx={{ pt: "80px" }}
      count={Math.ceil(max)}
      page={page}
      onChange={handleChange}
      showLastButton
      showFirstButton
    />
  );
};

export default function LostItems() {
  const [user_info, setuser_info] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [item, setitem] = useState("");
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);

  setConstraint(true);

  useEffect(() => {
    Axios({
      url: "http://localhost:5000/items",
      method: "GET",
    })
      .then((response) => {
        const allitems = response.data.items.reverse();
        const itemsPerPage = 9;
        const numItems = allitems.length;
        setMaxPages(Math.ceil(numItems / itemsPerPage));
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const data = allitems.slice(startIndex, endIndex);

        let items = [];
        data.forEach((item) => {
          if (item.type === "Lost") {
            let user = false;
            if (item.userId._id === user_info._id) user = true;

            let created_date = new Date(item.createdAt);
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

            items.push(
              <motion.div
                whileHover={{ scale: [null, 1.05, 1.05] }}
                transition={{ duration: 0.4 }}
                key={item._id}
              >
                <Card
                  sx={{
                    width: "270px",
                    height: "400px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <CardContent
                    sx={{
                      borderRadius: "8px",
                      padding: "8px",
                      gap: "16px",
                    }}
                  >
                    {/* 🖼️ Image with Status Badge */}
                    <Stack
                      sx={{
                        width: "100%",
                        height: "200px",
                        overflow: "hidden",
                        borderRadius: "8px",
                        position: "relative",
                        backgroundColor: "#9CC0DF",
                      }}
                    >
                      {/* ✅ Status Badge */}
                      <Stack
                        position="absolute"
                        top="10px"
                        right="10px"
                        px="10px"
                        py="5px"
                        borderRadius="12px"
                        sx={{
                          backgroundColor:
                            item.status === "approved"
                              ? "#4CAF50"
                              : item.status === "pending"
                              ? "#FFC107"
                              : "#F44336",
                        }}
                      >
                        <Typography
                          fontSize="13px"
                          color="white"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          {item.status}
                        </Typography>
                      </Stack>

                      {/* ✅ Item Image */}
                      <img
                        src={item.img?.[0] || "https://via.placeholder.com/150"}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Stack>

                    {/* ✅ Poster Name + Item Name */}
                    <Stack p="11px" gap="11px">
                      <Typography
                        noWrap
                        gutterBottom
                        fontSize="20px"
                        component="div"
                        fontWeight={"bold"}
                        m="0"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: "10px",
                        }}
                      >
                        {`${item.posterName || "Someone"} found ${item.name}`}
                      </Typography>
                    </Stack>

                    {/* ✅ Description */}
                    <Stack direction="row" width="100%" gap="15px">
                      <FcAbout fontSize="25px" />
                      <Typography
                        noWrap
                        fontSize="16px"
                        color="black"
                        width="100%"
                      >
                        {item.description.toString().slice(0, 30)} ...
                      </Typography>
                    </Stack>

                    {/* ✅ Date */}
                    <Stack pb="19px" pt="11px" direction="row" width="100%" gap="15px">
                      <FcOvertime fontSize="25px" />
                      <Typography ml="5px" noWrap fontSize="16px" color="black">
                        {createdAt}
                      </Typography>
                    </Stack>

                    {/* ✅ Button */}
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button
                        component={Link}
                        to={`/${item.name}?cid=${item._id}&type=${item.type}/${user}`}
                        variant={"contained"}
                        color="primary"
                        sx={{
                          textTransform: "none",
                          width: "140px",
                          borderRadius: "8px",
                        }}
                      >
                        More Details
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          }
        });
        setitem(items);
      })
      .catch((err) => console.log("Error :", err));
  }, [page]);

  return (
    <>
      {/* Header */}
      <Stack
        direction="row"
        width="100%"
        sx={{ backgroundColor: "primary.main" }}
        height="125px"
        gap="4px"
        alignItems="center"
        justifyContent="center"
      >
        <Stack
          spacing={0}
          position="relative"
          justifyContent="center"
          width="100%"
          maxWidth="1440px"
          height="125px"
          overflow="hidden"
          ml={{ xs: 3, sm: 5, md: 10 }}
        >
          <Typography
            fontSize={{ xs: "18px", sm: "22px", md: "25px" }}
            color="white"
          >
            Welcome {user_info.nickname} 👋!
          </Typography>
          <Typography
            fontSize={{ xs: "17px", sm: "21px", md: "23px" }}
            color="white"
            fontWeight="bold"
          >
            Here you can find the Lost Items
          </Typography>
        </Stack>
      </Stack>

      {/* Cards */}
      <Stack
        pt="20px"
        direction="row"
        justifyContent={"center"}
        flexWrap="wrap"
        gap="24px"
        maxWidth="1440px"
      >
        {item}
      </Stack>

      {/* Pagination */}
      <Paginationn page={page} setPage={setPage} max={maxPages} />
    </>
  );
}
