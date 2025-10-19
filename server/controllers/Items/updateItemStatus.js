import Item from '../../models/Item.js'

const updateItemStatus =  async (req, res) => {
  try {
    const { status } = req.body;
    console.log(status)

    // only allow valid statuses
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export default updateItemStatus;