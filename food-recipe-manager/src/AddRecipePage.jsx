import React from "react";
import Firebase, { storage } from "./Firebase.js";
import PulseLoader from "react-spinners/PulseLoader";
import { withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import addPhotoPlaceholder from "./assets/addPhotoPlaceholder.png";
import "./AddRecipePage.css";

class AddRecipePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            recipeUploading: false,
            nameValid: true,
            ingredientInputError: null,
            errorMessage: null,
            localPhoto: null,
            localPhotoPreview: null,
            localPhotoLoadError: null,

            // The recipe object structure:
            photoPath: null,
            photoDownloadUri: null,
            name: "",
            timeHours: 0,
            timeMinutes: 0,
            category: "Meat",
            type: "Breakfast",
            portions: 2,
            currentIngredientAmount: "",
            currentIngredientUnit: "N/A",
            currentIngredientName: "",
            ingredients: [],
            instructions: ""
        };

        this.isComponentMounted = false;

        this.handlePhotoChange = this.handlePhotoChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.removeLocalPhoto = this.removeLocalPhoto.bind(this);
        this.decrementPortions = this.decrementPortions.bind(this);
        this.incrementPortions = this.incrementPortions.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.instructionsTextareaChange = this.instructionsTextareaChange.bind(this);
        this.uploadRecipeToFirebase = this.uploadRecipeToFirebase.bind(this);
        this.deleteFirebaseUploadedPhoto = this.deleteFirebaseUploadedPhoto.bind(this);
    }

    componentDidMount() {
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    handlePhotoChange(e) {
        e.preventDefault();
        const photo = e.target.files[0];
        if (photo) {
            if (photo.size > 10000000) {
                this.setState({ localPhotoLoadError: "The photo is too big. Maximum size ~10mb." })
            } else {
                const photoPath = uuidv4();
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        localPhoto: photo,
                        localPhotoPreview: reader.result,
                        localPhotoLoadError: null,
                        photoPath: photoPath
                    });
                }
                reader.readAsDataURL(photo);
            }
        } else {
            this.setState({ localPhotoLoadError: "The photo could not be loaded. Please try again" })
        }
    }

    removeLocalPhoto(e) {
        e.preventDefault();
        this.setState({
            localPhoto: null,
            localPhotoPreview: null,
            localPhotoLoadError: null,
            photoPath: null
        });
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    decrementPortions(e) {
        e.preventDefault();
        if (this.state.portions > 1) {
            this.setState(prevState => ({
                portions: prevState.portions - 1
            }));
        }
    }

    incrementPortions(e) {
        e.preventDefault();
        if (this.state.portions < 99) {
            this.setState(prevState => ({
                portions: prevState.portions + 1
            }));
        }
    }

    addIngredient(e) {
        e.preventDefault();
        if (this.state.currentIngredientName.trim() !== "") {
            if (!this.state.ingredients.some(ingredient => ingredient.name === this.state.currentIngredientName)) {
                this.setState(prevState => ({
                    ingredientInputError: null,
                    ingredients: [...prevState.ingredients, { amount: prevState.currentIngredientAmount ? parseFloat(prevState.currentIngredientAmount) : null, unit: prevState.currentIngredientUnit, name: prevState.currentIngredientName }],
                    currentIngredientAmount: "",
                    currentIngredientUnit: "N/A",
                    currentIngredientName: ""
                }));
            } else {
                this.setState({
                    ingredientInputError: "The ingredient already exists."
                });
            }
        } else {
            this.setState({
                ingredientInputError: "Please input at least a name."
            });
        }
    }

    removeIngredient(e) {
        if (this.state.ingredients.length === 1) {
            this.setState(prevState => ({
                ingredientInputError: "Please add at least one ingredient.",
                ingredients: prevState.ingredients.filter(ingredient => ingredient.name !== e.name)
            }));
        } else {
            this.setState(prevState => ({
                ingredients: prevState.ingredients.filter(ingredient => ingredient.name !== e.name)
            }));
        }
    }

    instructionsTextareaChange(e) {
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight - 4 + "px";
        this.setState({
            instructions: e.target.value
        });
    }

    checkAllFieldsValid() {
        // Add other necessary checks too...
        return this.ingredientsAdded();
    }

    ingredientsAdded() {
        if (this.state.ingredients && this.state.ingredients.length) {
            this.setState({
                ingredientInputError: null
            });
            return true;
        }
        this.setState({
            ingredientInputError: "Please add at least one ingredient.",
            errorMessage: "Please add at least one ingredient."
        });
        return false;
    }

    deleteFirebaseUploadedPhoto() {
        const storageRef = storage.ref("images/" + this.props.user.uid + "/" + this.state.photoPath);
        storageRef.delete().then(() => {
            if (this.isComponentMounted) {
                this.setState({
                    recipeUploading: false,
                    errorMessage: "Recipe could not be added, please try again."
                });
            }
        }).catch((error) => {
            // !TODO: What to do if the uploaded photo that should be deleted due to database upload failure, cannot be deleted?
        });
    }

    uploadRecipeToFirebase(e) {
        e.preventDefault();
        if (this.checkAllFieldsValid()) {
            this.setState({
                recipeUploading: true,
                errorMessage: null
            });

            this.databaseRef = Firebase.database().ref("recipes/" + this.props.user.uid);
            this.databaseRef.orderByChild("name").equalTo(this.state.name).once("value").then((snapshot) => {
                if (!snapshot.val()) {
                    let recipe = {
                        photoPath: this.state.photoPath,
                        name: this.state.name,
                        timeHours: parseInt(this.state.timeHours, 10),
                        timeMinutes: parseInt(this.state.timeMinutes, 10),
                        category: this.state.category,
                        type: this.state.type,
                        portions: this.state.portions,
                        ingredients: this.state.ingredients,
                        instructions: this.state.instructions,
                    };
                    if (this.state.photoPath) {
                        const storageRef = storage.ref("images/" + this.props.user.uid + "/" + this.state.photoPath);
                        storageRef.put(this.state.localPhoto).then(() => {
                            storageRef.getDownloadURL().then((url) => {
                                recipe.photoDownloadUri = url;
                                this.databaseRef.push(recipe).then(() => {
                                    if (this.isComponentMounted) {
                                        this.props.history.push(
                                            "/user/recipes/details/" + this.state.name,
                                            { recipe: recipe }
                                        );
                                    }
                                }).catch(() => {
                                    // Error: Could not add the recipe to Firebase RealTimeDatabase.
                                    this.deleteFirebaseUploadedPhoto();
                                });
                            }).catch(() => {
                                // Error: Could not fetch the photo DownloadURL from Firebase Storage.
                                this.deleteFirebaseUploadedPhoto();
                            });
                        }).catch(() => {
                            // Error: Photo could not be uploaded to Firebase Storage.
                            if (this.isComponentMounted) {
                                this.setState({
                                    recipeUploading: false,
                                    errorMessage: "Recipe could not be added, please try again."
                                });
                            }
                        });
                    } else {
                        this.databaseRef.push(recipe).then(() => {
                            if (this.isComponentMounted) {
                                this.props.history.push(
                                    "/user/recipes/details/" + this.state.name,
                                    { recipe: recipe }
                                );
                            }
                        }).catch(() => {
                            // Error: Could not add the recipe to Firebase RealTimeDatabase.
                            this.deleteFirebaseUploadedPhoto();
                        });
                    }
                } else {
                    // Error: The entered recipe name already exists.
                    if (this.isComponentMounted) {
                        this.setState({
                            recipeUploading: false,
                            nameValid: false,
                            errorMessage: "Name already exists."
                        });
                    }
                }
            }).catch(() => {
                // Error: Could not fetch from Firebase.
                if (this.isComponentMounted) {
                    this.setState({
                        recipeUploading: false,
                        errorMessage: "Recipe could not be added, please try again."
                    });
                }
            });
        } else {
            // Error: All fields not valid.
            if (this.isComponentMounted) {
                this.setState({
                    recipeUploading: false,
                    errorMessage: "Please enter valid values."
                });
            }
        }
    }

    render() {
        return (
            <form className="addRecipePage" onSubmit={this.uploadRecipeToFirebase}>
                <div className="addRecipePageTop">
                    {/* ============================== Photo ============================== */}
                    <div className="addRecipePageTopLeft">
                        <label className="addRecipePagePhotoHolder">
                            <input className="addRecipePagePhotoInput" type="file" name="photo" accept="image/*" onClick={e => e.target.value = null} onChange={this.handlePhotoChange} />
                            {this.state.localPhoto ?
                                <img className="addRecipePagePhoto" src={this.state.localPhotoPreview} alt="Click to change" />
                                :
                                <img className="addRecipePagePhotoPlaceholderImage" src={addPhotoPlaceholder} alt="Click to add" />
                            }
                        </label>
                        {this.state.localPhotoLoadError ?
                            <div className="addRecipePagePhotoErrorLabel">
                                {this.state.localPhotoLoadError}
                            </div>
                            :
                            this.state.localPhoto &&
                            <div className="addRecipePagePhotoRemove">
                                <button className="addRecipePagePhotoRemoveButton" onClick={this.removeLocalPhoto}>Remove photo</button>
                            </div>
                        }
                    </div>

                    <div className="addRecipePageTopRight">

                        {/* ============================== Name ============================== */}
                        <div className="addRecipePageName">
                            <div className="addRecipePageNameLabel">Name:</div>
                            <input className="addRecipePageNameInput" type="text" name="name" placeholder="Add name..." onChange={this.handleInputChange} value={this.state.name} minLength="1" maxLength="25" autoComplete="off" required />
                            <div className="addRecipePageNameErrorLabel">
                                {this.state.nameValid ? null : "Name already exists."}
                            </div>

                        </div>

                        {/* ============================== Category and Type ============================== */}
                        <div className="addRecipePageCategoryAndType">

                            {/* ============================== Category ============================== */}
                            <div className="addRecipePageCategory">
                                <div className="addRecipePageCategoryLabel">Category:</div>
                                <select className="addRecipePageCategorySelector" name="category" onChange={this.handleInputChange}>
                                    <option value="Meat">Meat</option>
                                    <option value="Vegetarian">Vegetarian</option>
                                    <option value="Vegan">Vegan</option>
                                </select>
                            </div>

                            {/* ============================== Type ============================== */}
                            <div className="addRecipePageType">
                                <div className="addRecipePageTypeLabel">Type:</div>
                                <select className="addRecipePageTypeSelector" name="type" onChange={this.handleInputChange}>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Light meal">Light meal</option>
                                    <option value="Heavy meal">Heavy meal</option>
                                    <option value="Dessert">Dessert</option>
                                </select>
                            </div>
                        </div>

                        {/* ============================== Time ============================== */}
                        <div className="addRecipePageTime">
                            <div className="addRecipePageTimeLabel">Time:</div>
                            <div className="addRecipePageTimeInput">
                                <input className="addRecipePageTimeHoursInput" type="number" name="timeHours" placeholder="hh" onChange={this.handleInputChange} value={this.state.timeHours} min="0" max="99" autoComplete="off" required />
                                <div className="addRecipePageTimeHoursLabel">hours</div>
                                <input className="addRecipePageTimeMinutesInput" type="number" name="timeMinutes" placeholder="mm" onChange={this.handleInputChange} value={this.state.timeMinutes} min="0" max="59" autoComplete="off" required />
                                <div className="addRecipePageTimeMinutesLabel">minutes</div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="addRecipePageBottom">
                    <div className="addRecipePageBottomLeft">
                        {/* ============================== Portions ============================== */}
                        <div className="addRecipePagePortions">
                            <div className="addRecipePagePortionsLabel">Portions:</div>
                            <button className="addRecipePagePortionsDecrementButton" onClick={this.decrementPortions}>-</button>
                            {this.state.portions}
                            <button className="addRecipePagePortionsIncrementButton" onClick={this.incrementPortions}>+</button>
                        </div>

                        {/* ============================== Ingredients ============================== */}
                        <div className="addRecipePageIngredients">
                            <div className="addRecipePageIngredientsLabel">Ingredients:</div>
                            <div className="addRecipePageIngredientsInput">
                                <input className="addRecipePageIngredientsInputAmount" type="number" name="currentIngredientAmount" placeholder="Amount" autoComplete="off" onChange={this.handleInputChange} value={this.state.currentIngredientAmount} minLength="1" maxLength="9" />
                                <select className="addRecipePageIngredientsInputUnitSelector" name="currentIngredientUnit" onChange={this.handleInputChange}>
                                    <option value="N/A">N/A</option>
                                    <option value="mg">mg</option>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="tsb">tsb</option>
                                    <option value="tbsp">tbsp</option>
                                    <option value="ml">ml</option>
                                    <option value="dl">dl</option>
                                    <option value="l">l</option>
                                </select>
                                <input className="addRecipePageIngredientsInputName" type="text" name="currentIngredientName" placeholder="Name" autoComplete="off" onChange={this.handleInputChange} value={this.state.currentIngredientName} minLength="1" maxLength="20" />
                                <button className="addRecipePageIngredientsInputAddButton" onClick={this.addIngredient}>Add</button>
                            </div>
                            <ul className="addRecipePageIngredientsList">
                                {Object.keys(this.state.ingredients).map((ingredient => {
                                    return (<li className="addRecipePageIngredientsItem" key={this.state.ingredients[ingredient].name}>
                                        <div className="addRecipePageIngredientsItemAmount">{this.state.ingredients[ingredient].amount}</div>
                                        <div className="addRecipePageIngredientsItemUnit">{this.state.ingredients[ingredient].unit === "N/A" ? null : this.state.ingredients[ingredient].unit}</div>
                                        <div className="addRecipePageIngredientsItemName">{this.state.ingredients[ingredient].name}</div>
                                        <div className="addRecipePageIngredientsItemRemove"><button className="addRecipePageIngredientsItemRemoveButton" onClick={() => this.removeIngredient(this.state.ingredients[ingredient])}>X</button></div>
                                    </li>);
                                }))}
                            </ul>
                            <div className="addRecipePageIngredientsErrorLabel">
                                {this.state.ingredientInputError}
                            </div>
                        </div>
                    </div>

                    <div className="addRecipePageBottomRight">
                        {/* ============================== Instructions ============================== */}
                        <div className="addRecipePageInstructions">
                            <div className="addRecipePageInstructionsLabel">Instructions:</div>
                            <textarea className="addRecipePageInstructionsInput" name="instructions" onChange={this.instructionsTextareaChange} value={this.state.instructions} placeholder="Add instructions" required />
                        </div>
                    </div>
                </div>

                {/* ============================== Add button ============================== */}
                <div className="addRecipePageAddNewRecipe">
                    <div className="addRecipePageAddNewRecipeErrorLabel">
                        {this.state.errorMessage}
                    </div>
                    {this.state.recipeUploading ?
                        <div className="addRecipePageUploadingLoader">
                            <PulseLoader
                                size={15}
                                color={"#123abc"}
                                loading={this.state.recipeUploading}
                            />
                        </div>
                        :
                        <button className="addRecipePageAddNewRecipeButton">Add new recipe</button>
                    }
                </div>
            </form>
        );
    }
}

// Use withRouter in order to access history. This will enable this.props.history.push().
export default withRouter(AddRecipePage);