exports.getHome = (req, res) => {
  res.status(200).render("base", {
    title: "Welcome",
  });
};

exports.getOverview = (req, res) => {
  res.status(200).render("overview", {
    title: "All Tours",
  });
};

exports.getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "Tour",
  });
};
