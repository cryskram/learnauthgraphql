"use client";

import { storage } from "@/lib/firebase";
import { CREATE_ITEM, DELETE_ITEM, GET_ITEMS } from "@/lib/operation";
import { useMutation, useQuery } from "@apollo/client";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function Homepage() {
  const { data: session, status } = useSession();

  const { data, loading, error, refetch } = useQuery(GET_ITEMS);
  const [deleteItem] = useMutation(DELETE_ITEM);
  const [createItem] = useMutation(CREATE_ITEM);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [wait, setWait] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCreate = async () => {
    if (!name.trim() || !imageUrl.trim()) {
      return alert("Please enter name and imageUrl");
    }

    try {
      setWait(true);
      await createItem({
        variables: {
          name,
          description,
          imageUrl,
          userId: session?.user.id,
        },
        onCompleted: (data) => {
          toast.success(`Created ${data.createItem.name}`);
          refetch();
        },
      });
      setImagePreview("");
      setName("");
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log("Error occured:", error);
    } finally {
      setWait(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      const pathMatch = imageUrl.match(/\/o\/(.*?)\?/);
      const encodedPath = pathMatch?.[1];
      if (!encodedPath) throw new Error("Invalid image URL format");

      const decodedPath = decodeURIComponent(encodedPath);
      const imgRef = ref(storage, decodedPath);

      await deleteObject(imgRef);

      await deleteItem({
        variables: { id },
        onCompleted: (data) => {
          console.log(data);
          toast.success(`Deleted ${data.deleteItem.name}`);
        },
      });
      refetch();
    } catch (e) {
      console.error("Error deleting the item:", e);
    }
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      setImagePreview(URL.createObjectURL(file));
      const storageRef = ref(storage, `items/${Date.now()}_${file.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        setImageUrl(downloadUrl);
        toast.success("Image uploaded");
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Image upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl text-center">
          Image<span className="bg-black text-white px-1 rounded">Spam</span>
        </h1>
        {session?.user ? (
          <div className="flex items-center gap-4">
            <Image
              className="rounded-full"
              src={session.user?.image as string}
              width={48}
              height={48}
              alt="logo"
            />
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn("github")}
            className="p-2 bg-black text-white rounded text-xl"
          >
            Login
          </button>
        )}
      </div>
      {status === "unauthenticated" && (
        <h1 className="text-xl text-center">Please login to manage items</h1>
      )}
      <div>
        {status === "authenticated" && (
          <div className="flex flex-col gap-2">
            <input
              className="bg-slate-200 rounded-lg p-2"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="bg-slate-200 rounded-lg p-2"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="block w-full text-sm text-gray-500
             file:mr-4 file:py-2 file:px-4
             file:rounded-full file:border-0
             file:text-sm file:font-semibold
             file:bg-black file:text-white cursor-pointer"
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                width={500}
                height={500}
                alt="uploaded image"
              />
            )}
            <button
              onClick={handleCreate}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg text-lg disabled:bg-slate-700"
              disabled={wait || uploading}
            >
              {uploading || wait ? "Uploading..." : "Create"}
            </button>
          </div>
        )}
        {loading && <p>loading...</p>}
        {error && <p>Error occured: {error.message}</p>}

        {data?.items?.length > 0 ? (
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {data?.items?.map((item: any) => (
              <div
                key={item.id}
                className="bg-slate-100 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between"
              >
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
                    {item.name}
                  </h1>
                  <p className="text-gray-600 text-center mb-4">
                    {item.description}
                  </p>
                  <Image
                    src={item.imageUrl}
                    width={250}
                    height={250}
                    alt={item.name}
                    className="rounded-xl object-cover shadow-sm"
                  />
                </div>

                {(session?.user.role === "ADMIN" ||
                  session?.user.id === item.userId) && (
                  <button
                    onClick={() => handleDelete(item.id, item.imageUrl)}
                    className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg text-lg transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-8">No Items currently</p>
        )}
      </div>
    </div>
  );
}
