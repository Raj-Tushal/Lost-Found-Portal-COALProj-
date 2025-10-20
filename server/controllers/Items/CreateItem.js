import Item from '../../models/Item.js'
import User from '../../models/User.js'

const createItem = async (req, res) => {
  try {
    const itemData = req.body;
    const userId = req.userId; // comes from middleware

    // ✅ 1. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, msg: 'User not found' });
    }

    // ✅ 2. Get user's display name
    const posterName = user.fullname || user.nickname;

    // ✅ 3. Create new item with userId + posterName included
    const newItem = new Item({
      ...itemData,
      userId,
      posterName,
      img: itemData.img || [], // fallback to array if not sent
    });

    // ✅ 4. If a file is uploaded, replace default image
    if (req.file) {
      newItem.img = [req.file.path];
    }

    // ✅ 5. Save and respond
    await newItem.save();

    res.status(201).json({
      ok: true,
      msg: 'Item created successfully',
      item: newItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: 'An error occurred, please contact admin',
    });
  }
};

export default createItem;
