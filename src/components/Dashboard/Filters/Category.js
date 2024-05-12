import {useEffect, useState} from "react"
import {CategoryService} from "../../../services/supplier"

function Category(props) {
  const [open, setOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const close = () => {
    setOpen(false)
  }

  const getAllCategories = async () => {
    try {
      const categoryService = new CategoryService()
      const {
        data: {categories},
      } = await categoryService.getAllCategories(0, 10)
      console.log(categories)
      setCategories(categories)
    } catch (error) {
      console.error({error})
    }
  }

  useEffect(() => {
    getAllCategories()
  }, [])

  const handleCategorySelect = selectedCategory => {
    console.log(selectedCategory,"category")
    props.setCategory(selectedCategory)
    close() // Close the dropdown after selecting a category
  }

  return (
    <div style={props.style} className="categorie__dropdown nft_explore_filter">
      <span>
        <img src="assets/img/filter_ico_1.svg" alt="" />
      </span>
      <div
        className={open ? "nice-select open" : "nice-select"}
        onClick={() => setOpen(!open)}
        tabIndex={0}
      >
        <span className="current">{props.category?.name || "Category"}</span>
        <ul className="list">
          <li
            data-value="Category"
            data-display="Category"
            className="option selected"
            onClick={() => props.setCategory({})}
          >
            Category
          </li>
          {categories?.length > 0 &&
            categories.map((category, index) => (
              <li
                key={index}
                data-value={category.name} // Assuming category is a string
                className="option"
                onClick={() => handleCategorySelect(category)}
              >
                {category.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Category
