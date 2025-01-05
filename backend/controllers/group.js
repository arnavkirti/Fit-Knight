const Group = require("../modals/Group");

exports.GroupInfo = async (req, res) => {
  try {
    const groupId = req.query.id;
    const group = await Group.findOne({ _id: groupId });
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }
    res.status(200).json({ group });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching group info", details: err.message });
  }
};
