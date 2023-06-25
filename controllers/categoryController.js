const Category = require('../models/categoryModel')
const jwt = require('jsonwebtoken')


const getCategory = async (req, res) => {
    try {
       const category = await Category.find({})

       res.json({ message: "All Categories", category })
    } catch (error) {
        res.send(error)
    }
}


const createCategory = async (req, res) => {
    const { name, sub_category } = req.body;

    if(!name || !sub_category){
        return res.send("Plz fill al the fields!")
    }

    try {
        const categoryExist = await Category.findOne({ name })

        if(categoryExist){
const sub_categoryExist = categoryExist.sub_category.find(sub => sub.sub_name === sub_category[0].sub_name && sub.sub_brand === sub_category[0].sub_brand);
                if(sub_categoryExist){
                    return res.json({message: "Sub Category Already Existed!"})
                }else{
                    await Category.updateOne(
                        { _id: categoryExist._id },
                        { $push: { sub_category } }
                      );
                   return res.json({message: "Sub Category Created Successfully!"})
                }
            

        }
        else{
            const category = await Category.create({
                name,
                sub_category
            })
        
            return res.json({message: "New Category Created Successfully!", category})
        }
      
    } catch (error) {
        res.send(error)
    }
   
}

const updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const {name, sub_category} = req.body;
        const {subId, sub_name, sub_brand} = sub_category;

        const category = await Category.findOne({ _id: categoryId });
        if (!category) {
          res.status(404).send('Category not found');
          return;
        }
        const existSubCategory = category.sub_category.find(ele =>{
          if(ele._id == subId){
            return ele
          }
    
        })

        const index = category.sub_category.indexOf(existSubCategory)

    await Category.updateOne(
            { _id: categoryId },
            { $set: {"name": name, 
                    [`sub_category.${index}.sub_name`]: sub_name,
                    [`sub_category.${index}.sub_brand`]: sub_brand,
                } }
          );

        res.json({message: "Category Updated"})
            
    } catch (error) {
        res.send(error)
    }
}

const deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
        const category = await Category.find({_id: id})

        if(category){
            const deleted = await Category.deleteOne({ _id: id })
            if(deleted){
                res.json({ message: "Category Deleted!" })
            }
        }else{
            res.json({error: "Category not Found!"})
        }
    } catch (error) {
        res.send(error)
    }
}


module.exports = {createCategory, getCategory, updateCategory, deleteCategory};