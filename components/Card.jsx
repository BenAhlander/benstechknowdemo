"use client";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import ImageDialog from "./ImageDialog";

export default function MediaCard({ name, image, description }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card sx={{ height: "100%", cursor: "pointer" }} onClick={() => setOpen(true)}>
        <CardMedia sx={{ aspectRatio: "1 / 1" }} image={image} title={name} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
      <ImageDialog
        open={open}
        onClose={() => setOpen(false)}
        name={name}
        image={image}
      />
    </>
  );
}
