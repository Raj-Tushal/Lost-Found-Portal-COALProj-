import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Stack, Typography, Card, CardContent, Chip } from "@mui/material";

const API_URL = "http://localhost:5000/items";

const AdminDashboard = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data.items);
    } catch (err) {
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ✅ Filter items based on selected tab
  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.status === filter);

  // ✅ Count summary
  const countByStatus = (status) =>
    items.filter((item) => item.status === status).length;

  // ✅ Update item status (Approve/Reject)
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/items/updateStatus/${id}`, { status });
      fetchItems(); // Refresh list
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Stack p={4} spacing={4}>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        🛠️ Admin Dashboard
      </Typography>

      {/* ===== Summary Cards ===== */}
      <Stack direction="row" spacing={3} justifyContent="center" flexWrap="wrap">
        <Card sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h6">Pending</Typography>
          <Typography variant="h5" color="orange">
            {countByStatus("pending")}
          </Typography>
        </Card>

        <Card sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h6">Approved</Typography>
          <Typography variant="h5" color="green">
            {countByStatus("approved")}
          </Typography>
        </Card>

        <Card sx={{ p: 2, minWidth: 200, textAlign: "center" }}>
          <Typography variant="h6">Rejected</Typography>
          <Typography variant="h5" color="red">
            {countByStatus("rejected")}
          </Typography>
        </Card>
      </Stack>

      {/* ===== Filter Buttons ===== */}
      <Stack direction="row" spacing={2} justifyContent="center">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <Button
            key={s}
            variant={filter === s ? "contained" : "outlined"}
            color="primary"
            onClick={() => setFilter(s)}
          >
            {s.toUpperCase()}
          </Button>
        ))}
      </Stack>

      {/* ===== Item List ===== */}
      <Stack spacing={2}>
        {loading ? (
          <Typography align="center">Loading items...</Typography>
        ) : filteredItems.length === 0 ? (
          <Typography align="center">No items found.</Typography>
        ) : (
          filteredItems.map((item) => (
            <Card key={item._id} sx={{ p: 2 }}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  spacing={2}
                >
                  <Stack>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Type:</strong> {item.type}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Location:</strong> {item.location}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Date:</strong> {item.date}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Contact:</strong> {item.number}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip
                      label={item.status.toUpperCase()}
                      color={
                        item.status === "approved"
                          ? "success"
                          : item.status === "pending"
                          ? "warning"
                          : "error"
                      }
                    />

                    {item.status === "pending" && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => updateStatus(item._id, "approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => updateStatus(item._id, "rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Stack>
  );
};

export default AdminDashboard;
