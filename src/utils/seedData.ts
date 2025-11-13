import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { AuctionStatus } from "../types";

// Sample auction data with different statuses
const sampleAuctions = [
  {
    title: "Vintage Sports Car",
    description: "Classic 1967 Ford Mustang in excellent condition",
    category: "Automobili",
    startPrice: 25000,
    imageUrl: "https://example.com/car1.jpg",
    ownerId: "sample-owner-1",
    status: "approved" as AuctionStatus,
    endsAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  },
  {
    title: "Gaming Laptop",
    description: "High-end gaming laptop with RTX 4090",
    category: "Electronics",
    startPrice: 2000,
    imageUrl: "https://example.com/laptop.jpg",
    ownerId: "sample-owner-2",
    status: "pending" as AuctionStatus, // Pending for admin review
    endsAt: Timestamp.fromDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)),
  },
  {
    title: "Luxury Watch",
    description: "Swiss-made automatic watch",
    category: "Accessories",
    startPrice: 5000,
    imageUrl: "https://example.com/watch.jpg",
    ownerId: "sample-owner-1",
    status: "approved" as AuctionStatus,
    endsAt: Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)),
  },
  {
    title: "Mountain Bike",
    description: "Professional mountain bike, barely used",
    category: "Sports",
    startPrice: 800,
    imageUrl: "https://example.com/bike.jpg",
    ownerId: "sample-owner-3",
    status: "pending" as AuctionStatus, // Pending for admin review
    endsAt: Timestamp.fromDate(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)),
  },
  {
    title: "Antique Furniture Set",
    description: "Victorian era dining table and chairs",
    category: "Furniture",
    startPrice: 3500,
    imageUrl: "https://example.com/furniture.jpg",
    ownerId: "sample-owner-2",
    status: "pending" as AuctionStatus, // Pending for admin review
    endsAt: Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)),
  },
  {
    title: "Smartphone",
    description: "Latest model iPhone in mint condition",
    category: "Electronics",
    startPrice: 900,
    imageUrl: "https://example.com/phone.jpg",
    ownerId: "sample-owner-1",
    status: "approved" as AuctionStatus,
    endsAt: Timestamp.fromDate(new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)),
  },
];

// Function to seed auctions
export const seedAuctions = async () => {
  try {
    console.log("Starting to seed auctions...");
    
    const auctionIds: string[] = [];
    
    for (const auction of sampleAuctions) {
      const docRef = await addDoc(collection(db, "auctions"), {
        ...auction,
        currentBid: auction.startPrice,
        bidsCount: 0,
        createdAt: Timestamp.now(),
      });
      auctionIds.push(docRef.id);
      console.log(`Added auction: ${auction.title} with ID: ${docRef.id}`);
    }
    
    console.log("✅ Successfully seeded auctions!");
    return auctionIds;
  } catch (error) {
    console.error("Error seeding auctions:", error);
    throw error;
  }
};

// Function to seed bids for existing auctions
export const seedBids = async (auctionIds: string[], userIds: string[]) => {
  try {
    console.log("Starting to seed bids...");
    
    if (auctionIds.length === 0 || userIds.length === 0) {
      throw new Error("Need auction IDs and user IDs to seed bids");
    }
    
    // Create sample bids for first few auctions
    const sampleBids = [
      {
        auctionId: auctionIds[0],
        userId: userIds[0],
        amount: 26000,
      },
      {
        auctionId: auctionIds[0],
        userId: userIds[1] || userIds[0],
        amount: 27500,
      },
      {
        auctionId: auctionIds[1],
        userId: userIds[0],
        amount: 2200,
      },
      {
        auctionId: auctionIds[2],
        userId: userIds[1] || userIds[0],
        amount: 5500,
      },
    ];
    
    for (const bid of sampleBids) {
      await addDoc(collection(db, "bids"), {
        ...bid,
        createdAt: Timestamp.now(),
      });
      console.log(`Added bid for auction ${bid.auctionId}: $${bid.amount}`);
    }
    
    console.log("✅ Successfully seeded bids!");
  } catch (error) {
    console.error("Error seeding bids:", error);
    throw error;
  }
};

// Combined function to seed all data
export const seedAllData = async (userIds: string[]) => {
  try {
    const auctionIds = await seedAuctions();
    await seedBids(auctionIds, userIds);
    console.log("✅ All data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};
