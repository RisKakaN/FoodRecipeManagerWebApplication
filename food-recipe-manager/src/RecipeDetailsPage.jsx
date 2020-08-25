import React from "react";
import Firebase, { storage } from "./Firebase.js";
import PulseLoader from "react-spinners/PulseLoader";
import { withRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import addPhotoPlaceholder from "./assets/addPhotoPlaceholder.png";
import noPhotoAvailablePlaceholder from "./assets/noPhotoAvailablePlaceholder.png";
import "./RecipeDetailsPage.css";

class RecipeDetailsPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentRecipe: null,
            editModeActive: false,
            recipeChangesUploading: false,
            nameValid: true,
            timeFormatValid: true,
            ingredientInputError: null,
            errorMessage: null,
            localPhoto: null,
            photoPreview: null,
            localPhotoLoadError: null,

            // The recipe object structure:
            photoPath: null,
            photoDownloadUri: null,
            name: null,
            timeHours: null,
            timeMinutes: null,
            category: null,
            type: null,
            portions: null,
            currentIngredientAmount: "",
            currentIngredientUnit: "N/A",
            currentIngredientName: "",
            ingredients: [],
            instructions: null,

            // States for displaying dynamic ingredient proportions according to number of portions set:
            dynamicPortions: null,
            dynamicIngredientsMultiplier: 1, // = (dynamicPortions / this.state.portions)
        };

        this.instructionsTextAreaRef = React.createRef();

        this.dataLoading = true;
        this.isComponentMounted = false;

        this.handlePhotoChange = this.handlePhotoChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.removeLocalPhoto = this.removeLocalPhoto.bind(this);
        this.decrementPortions = this.decrementPortions.bind(this);
        this.incrementPortions = this.incrementPortions.bind(this);
        this.addIngredient = this.addIngredient.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
        this.instructionsTextareaChange = this.instructionsTextareaChange.bind(this);

        this.activateEditMode = this.activateEditMode.bind(this);
        this.cancelEditMode = this.cancelEditMode.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
    }

    componentDidMount() {
        this.isComponentMounted = true;
        this.fetchRecipeData();
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
                // Only generate new photoPath (name of the photo) if a previous photoPath did not exist.
                // This is because replacing a photo should keep the same name.
                const photoPath = this.state.photoPath ? this.state.photoPath : uuidv4();
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        localPhoto: photo,
                        photoPreview: reader.result,
                        localPhotoLoadError: null,
                        photoPath: photoPath,
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
            photoPreview: null,
            localPhotoLoadError: null
        });
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    decrementPortions(e) {
        e.preventDefault();
        // Adjust portions for saving.
        if (this.state.editModeActive) {
            if (this.state.portions > 1) {
                this.setState(prevState => ({
                    portions: prevState.portions - 1
                }));
            }
        } else {
            // Adjust portions for dynamic ingredients to portions proportions.
            if (this.state.dynamicPortions > 1) {
                this.setState(prevState => ({
                    dynamicPortions: prevState.dynamicPortions - 1,
                    dynamicIngredientsMultiplier: (prevState.dynamicPortions - 1) / this.state.currentRecipe.portions
                }));
            }
        }
    }

    incrementPortions(e) {
        e.preventDefault();
        // Adjust portions for saving.
        if (this.state.editModeActive) {
            if (this.state.portions < 99) {
                this.setState(prevState => ({
                    portions: prevState.portions + 1
                }));
            }
        } else {
            // Adjust portions for dynamic ingredients to portions proportions.
            if (this.state.portions < 99) {
                this.setState(prevState => ({
                    dynamicPortions: prevState.dynamicPortions + 1,
                    dynamicIngredientsMultiplier: (prevState.dynamicPortions + 1) / this.state.currentRecipe.portions
                }));
            }
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

    instructionsTextareaChange(target) {
        target.style.height = "auto";
        target.style.height = target.scrollHeight - 4 + "px";
        this.setState({
            instructions: target.value
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

    fetchRecipeData() {
        if ((typeof this.props.location.state !== "undefined")) {
            this.dataLoading = false;
            const recipe = this.props.location.state.recipe;
            this.originalName = recipe.name;
            this.setState({
                currentRecipe: recipe,
                dynamicPortions: recipe.portions,
                localPhoto: recipe.photoDownloadUri, // Set for later comparison whether photo changed.
                photoPreview: recipe.photoDownloadUri, // Set to handle photo displaying.
            });
        } else {
            Firebase.database().ref("recipes/" + this.props.user.uid).orderByChild("name").equalTo(this.props.match.params.recipeRouteName).once("value", (snapshot) => {
                if (snapshot.val() && this.isComponentMounted) {
                    this.dataLoading = false;
                    const recipe = Object.values(snapshot.val())[0];
                    this.originalName = recipe.name;
                    this.setState({
                        currentRecipe: recipe,
                        dynamicPortions: recipe.portions,
                        localPhoto: recipe.photoDownloadUri, // Set for later comparison whether photo changed.
                        photoPreview: recipe.photoDownloadUri, // Set to handle photo displaying.
                    });
                } else {
                    // Trying to enter a url for a recipe that does not exist will cause redirection to NotFoundPage.
                    this.props.history.replace("/404");
                }
            });
        }
    }

    // Function for deleting the current Firebase uploaded photo, which is needed in case Realtime database upload fails, 
    // because photo should not exist without the actual recipe (which should be stored/uploaded in the database).
    // This function will provide an error, since its purpose is to resolve Firebase uploading failure.
    deleteCurrentFirebaseUploadedPhoto() {
        // If photo was changed.
        if (this.state.photoDownloadUri !== this.state.localPhoto) {
            const storageRef = storage.ref("images/" + this.props.user.uid + "/" + this.state.photoPath);
            storageRef.delete().then(() => {
                if (this.isComponentMounted) {
                    this.setState({
                        recipeChangesUploading: false,
                        errorMessage: "Recipe could not be edited, please try again."
                    });
                }
            }).catch((error) => {
                // !TODO: What to do if the uploaded photo that should be deleted due to database upload failure, cannot be deleted?
            });
        } else {
            this.setState({
                recipeChangesUploading: false,
                errorMessage: "Recipe could not be edited, please try again."
            });
        }
    }

    uploadRecipeChangesToFirebase(recipeReference) {
        let recipe = {
            photoPath: this.state.photoPath ? this.state.photoPath : null, // Check whether it exists, since this field is optional.
            photoDownloadUri: this.state.photoDownloadUri ? this.state.photoDownloadUri : null, // Check whether it exists, since this field is optional.
            name: this.state.name,
            timeHours: parseInt(this.state.timeHours, 10),
            timeMinutes: parseInt(this.state.timeMinutes, 10),
            category: this.state.category,
            type: this.state.type,
            portions: this.state.portions,
            ingredients: this.state.ingredients,
            instructions: this.state.instructions,
        };
        // Upload new photo if it was changed/deleted.
        if (this.state.localPhoto !== this.state.photoDownloadUri) {
            const storageRef = storage.ref("images/" + this.props.user.uid + "/" + this.state.photoPath);
            // Upload new photo to storage, and upload new changes to realtime database.
            if (this.state.localPhoto !== null) {
                storageRef.put(this.state.localPhoto).then(() => {
                    storageRef.getDownloadURL().then((url) => {
                        recipe.photoPath = this.state.photoPath;
                        recipe.photoDownloadUri = url;
                        recipeReference.set(recipe).then(() => {
                            if (this.isComponentMounted) {
                                if (this.originalName !== recipe.name) {
                                    this.originalName = recipe.name;
                                }
                                this.setState({
                                    currentRecipe: recipe,
                                    dynamicPortions: recipe.portions,
                                    localPhoto: recipe.photoDownloadUri,
                                    photoPreview: recipe.photoDownloadUri,
                                    recipeChangesUploading: false,
                                });
                                this.props.history.replace({ pathname: "/recipes/details/" + recipe.name, recipe: recipe });
                                this.finishEditMode();
                            }
                        }).catch(() => {
                            // Error: Could not add the recipe to Firebase RealTimeDatabase.
                            this.deleteCurrentFirebaseUploadedPhoto();
                        });
                    }).catch(() => {
                        // Error: Could not fetch the photo DownloadURL from Firebase Storage.
                        this.deleteCurrentFirebaseUploadedPhoto();
                    });
                }).catch(() => {
                    // Error: Photo could not be uploaded to Firebase Storage.
                    if (this.isComponentMounted) {
                        this.setState({
                            recipeChangesUploading: false,
                            errorMessage: "Recipe could not be edited, please try again."
                        });
                    }
                });
            } else if (this.state.localPhoto === null) {
                // Delete old photo from storage, and upload new changes to realtime database.
                storageRef.delete().then(() => {
                    if (this.isComponentMounted) {
                        recipe.photoPath = null;
                        recipe.photoDownloadUri = null;
                        recipeReference.set(recipe).then(() => {
                            if (this.isComponentMounted) {
                                if (this.originalName !== recipe.name) {
                                    this.originalName = recipe.name;
                                }
                                this.setState({
                                    currentRecipe: recipe,
                                    dynamicPortions: recipe.portions,
                                    localPhoto: null,
                                    photoPreview: null,
                                    recipeChangesUploading: false
                                });
                                this.props.history.replace({ pathname: "/recipes/details/" + recipe.name, recipe: recipe });
                                this.finishEditMode();
                            }
                        }).catch(() => {
                            // Error: Could not add the recipe to Firebase RealTimeDatabase.
                            this.deleteCurrentFirebaseUploadedPhoto();
                        });
                    }
                }).catch((error) => {
                    // !TODO: What to do if the uploaded photo that should be deleted due to database upload failure, cannot be deleted?
                });
            }
        } else {
            recipeReference.set(recipe).then(() => {
                if (this.isComponentMounted) {
                    if (this.originalName !== recipe.name) {
                        this.originalName = recipe.name;
                    }
                    this.setState({
                        currentRecipe: recipe,
                        dynamicPortions: recipe.portions,
                        recipeChangesUploading: false,
                    });
                    this.props.history.replace({ pathname: "/recipes/details/" + recipe.name, recipe: recipe });
                    this.finishEditMode();
                }
            }).catch(() => {
                // Error: Could not add the recipe to Firebase RealTimeDatabase.
                if (this.isComponentMounted) {
                    this.setState({
                        recipeChangesUploading: false,
                        errorMessage: "Recipe could not be edited, please try again."
                    });
                }
            });
        }
    }

    activateEditMode(e) {
        e.preventDefault();
        const currentRecipe = this.state.currentRecipe;
        this.setState({
            editModeActive: true,

            localPhoto: currentRecipe.photoDownloadUri,
            photoPreview: currentRecipe.photoDownloadUri,

            photoPath: currentRecipe.photoPath,
            photoDownloadUri: currentRecipe.photoDownloadUri,
            name: currentRecipe.name,
            timeHours: currentRecipe.timeHours,
            timeMinutes: currentRecipe.timeMinutes,
            category: currentRecipe.category,
            type: currentRecipe.type,
            portions: currentRecipe.portions,
            ingredients: currentRecipe.ingredients,
            instructions: currentRecipe.instructions
        }, () => {
            this.instructionsTextareaChange(this.instructionsTextAreaRef.current)
        });
    }

    cancelEditMode(e) {
        e.preventDefault();
        this.setState({
            editModeActive: false,
            errorMessage: null,
            photoPreview: this.state.currentRecipe.photoDownloadUri // Reset in case it was changed.
        });
    }

    finishEditMode() {
        this.setState({ editModeActive: false });
    }

    saveChanges(e) {
        e.preventDefault();
        if (this.checkAllFieldsValid()) {
            this.setState({
                recipeChangesUploading: true,
                errorMessage: null
            });
            Firebase.database().ref("recipes/" + this.props.user.uid).orderByChild("name").equalTo(this.originalName).once("value").then((snapshot) => {
                if (snapshot.val()) {
                    const recipeReference = Firebase.database().ref("recipes/" + this.props.user.uid + "/" + Object.keys(snapshot.val()));

                    if (this.state.name === this.originalName) {
                        // Name did not change. So no need to check whether a name already exists. (All recipe names should be unique).
                        this.uploadRecipeChangesToFirebase(recipeReference);
                    } else {
                        // Name changed. So need to check whether the new name already exists. (All recipe names should be unique).
                        Firebase.database().ref("recipes/" + this.props.user.uid).orderByChild("name").equalTo(this.state.name).once("value").then((snapshot) => {
                            if (!snapshot.val()) {
                                // New recipe name does not exist. Proceed to change the name.
                                this.uploadRecipeChangesToFirebase(recipeReference);
                            } else {
                                // Error: Recipe name exists.
                                if (this.isComponentMounted) {
                                    this.setState({
                                        recipeChangesUploading: false,
                                        nameValid: false,
                                        errorMessage: "Name already exists.",
                                    });
                                }
                            }
                        }).catch(() => {
                            //Error: Could not fetch Firebase database properly.
                            if (this.isComponentMounted) {
                                this.setState({
                                    recipeChangesUploading: false,
                                    errorMessage: "Recipe could not be edited, please try again."
                                });
                            }
                        });
                    }
                } else {
                    // Error: Could not find the recipe to be edited.
                    if (this.isComponentMounted) {
                        this.setState({
                            recipeChangesUploading: false,
                            errorMessage: "Recipe could not be edited, please try again."
                        });
                    }
                }
            }).catch((error) => {
                // Error: Could not fetch from Firebase.
                if (this.isComponentMounted) {
                    this.setState({
                        recipeChangesUploading: false,
                        errorMessage: "Recipe could not be edited, please try again."
                    });
                }
            });
        } else {
            // Error: All fields not valid.
            if (this.isComponentMounted) {
                this.setState({
                    recipeChangesUploading: false,
                    errorMessage: "Please enter valid values.",
                });
            }
        }
    }

    deleteRecipe(e) {
        e.preventDefault();
        this.setState({ recipeChangesUploading: true });
        Firebase.database().ref("recipes/" + this.props.user.uid).orderByChild("name").equalTo(this.originalName).once("value").then((snapshot) => {
            const recipeReference = Firebase.database().ref("recipes/" + this.props.user.uid + "/" + Object.keys(snapshot.val()));
            if (this.state.photoPath) {
                storage.ref("images/" + this.props.user.uid + "/" + this.state.photoPath).delete().then(() => {
                    recipeReference.remove().then(() => {
                        this.props.history.push("/recipes");
                    }).catch(() => {
                        if (this.isComponentMounted) {
                            this.setState({
                                recipeChangesUploading: false,
                                errorMessage: "Recipe could not be deleted, please try again."
                            });
                        }
                    });
                }).catch(() => {
                    if (this.isComponentMounted) {
                        this.setState({
                            recipeChangesUploading: false,
                            errorMessage: "Recipe could not be deleted, please try again."
                        });
                    }
                });
            } else {
                recipeReference.remove().then(() => {
                    this.props.history.push("/recipes");
                }).catch(() => {
                    if (this.isComponentMounted) {
                        this.setState({
                            recipeChangesUploading: false,
                            errorMessage: "Recipe could not be deleted, please try again."
                        });
                    }
                });
            }
        }).catch(() => {
            if (this.isComponentMounted) {
                this.setState({
                    recipeChangesUploading: false,
                    errorMessage: "Recipe could not be deleted, please try again."
                });
            }
        });
    }

    render() {
        const currentRecipe = this.state.currentRecipe;
        const ingredients = currentRecipe ? currentRecipe.ingredients : null;
        return (
            <form className="recipeDetailsPage" onSubmit={this.saveChanges}>
                {!this.dataLoading ? // Show loading animation while data is being loaded.
                    <>
                        <div className="recipeDetailsPageTop">
                            {/* ============================== Photo ============================== */}
                            <div className="recipeDetailsPageTopLeft">
                                {!this.state.editModeActive ?
                                    this.state.photoPreview ?
                                        <img className="recipeDetailsPagePhoto" src={this.state.photoPreview} alt="Recipe" style={{ cursor: "default" }} />
                                        :
                                        <img className="recipeDetailsPagePhotoPlaceholderImage" src={noPhotoAvailablePlaceholder} alt="Not available" />
                                    :
                                    <>
                                        <label className="recipeDetailsPagePhotoHolder">
                                            <input type="file" name="photo" accept="image/*" onClick={e => e.target.value = null} onChange={this.handlePhotoChange} />
                                            {this.state.photoPreview ?
                                                <img className="recipeDetailsPagePhoto" src={this.state.photoPreview} alt="Click to change" />
                                                :
                                                <img className="recipeDetailsPagePhotoPlaceholderImage" src={addPhotoPlaceholder} alt="Click to add" />
                                            }
                                        </label>
                                        {this.state.localPhotoLoadError ?
                                            <div className="recipeDetailsPagePhotoErrorLabel">
                                                {this.state.localPhotoLoadError}
                                            </div>
                                            :
                                            this.state.localPhoto &&
                                            <div className="recipeDetailsPagePhotoRemove">
                                                <button className="recipeDetailsPagePhotoRemoveButton" onClick={this.removeLocalPhoto}>Remove photo</button>
                                            </div>
                                        }
                                    </>
                                }
                            </div>

                            <div className="recipeDetailsPageTopRight">

                                {/* ============================== Name ============================== */}
                                <div className="recipeDetailsPageNameLabel">Name:</div>
                                <div className="recipeDetailsPageName">
                                    {!this.state.editModeActive ?
                                        currentRecipe.name
                                        :
                                        <>
                                            <input className="recipeDetailsPageNameInput" type="text" name="name" placeholder="Add name..." onChange={this.handleInputChange} value={this.state.name} minLength="1" maxLength="25" autoComplete="off" required />
                                            <div className="recipeDetailsPageNameErrorLabel">
                                                {this.state.nameValid ? null : "Name already exists."}
                                            </div>
                                        </>
                                    }
                                </div>
                                {/* ============================== Category and Type ============================== */}
                                <div className="recipeDetailsPageCategoryAndType">

                                    {/* ============================== Category ============================== */}
                                    <div className="recipeDetailsPageCategory">
                                        <div className="recipeDetailsPageCategoryLabel">Category:</div>
                                        {!this.state.editModeActive ?
                                            currentRecipe.category
                                            :
                                            <select className="recipeDetailsPageCategorySelector" name="category" value={this.state.category} onChange={this.handleInputChange}>
                                                <option value="Meat">Meat</option>
                                                <option value="Vegetarian">Vegetarian</option>
                                                <option value="Vegan">Vegan</option>
                                            </select>
                                        }
                                    </div>

                                    {/* ============================== Type ============================== */}
                                    <div className="recipeDetailsPageType">
                                        <div className="recipeDetailsPageTypeLabel">Type:</div>
                                        {!this.state.editModeActive ?
                                            currentRecipe.type
                                            :
                                            <select className="recipeDetailsPageTypeSelector" name="type" value={this.state.type} onChange={this.handleInputChange}>
                                                <option value="Breakfast">Breakfast</option>
                                                <option value="Light meal">Light meal</option>
                                                <option value="Heavy meal">Heavy meal</option>
                                                <option value="Dessert">Dessert</option>
                                            </select>
                                        }
                                    </div>
                                </div>

                                {/* ============================== Time ============================== */}
                                <div className="recipeDetailsPageTime">
                                    <div className="recipeDetailsPageTimeLabel">Time:</div>
                                    <div className="recipeDetailsPageTimeInput">
                                        {!this.state.editModeActive ?
                                            <div className="recipeDetailsPageTimeHours">{currentRecipe.timeHours}</div>
                                            :
                                            <input className="recipeDetailsPageTimeHoursInput" type="number" name="timeHours" placeholder="hh" onChange={this.handleInputChange} value={this.state.timeHours} min="0" max="99" autoComplete="off" required />
                                        }
                                        <div className="recipeDetailsPageTimeHoursLabel">hours</div>
                                        {!this.state.editModeActive ?
                                            <div className="recipeDetailsPageTimeMinutes">{currentRecipe.timeMinutes}</div>
                                            :
                                            <input className="recipeDetailsPageTimeMinutesInput" type="number" name="timeMinutes" placeholder="mm" onChange={this.handleInputChange} value={this.state.timeMinutes} min="0" max="59" autoComplete="off" required />
                                        }
                                        <div className="recipeDetailsPageTimeMinutesLabel">minutes</div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="recipeDetailsPageBottom">
                            <div className="recipeDetailsPageBottomLeft">
                                {/* ============================== Portions ============================== */}
                                <div className="recipeDetailsPagePortions">
                                    <div className="recipeDetailsPagePortionsLabel">Portions:</div>
                                    <button className="recipeDetailsPagePortionsDecrementButton" onClick={this.decrementPortions}>-</button>
                                    {!this.state.editModeActive ? this.state.dynamicPortions : this.state.portions}
                                    <button className="recipeDetailsPagePortionsIncrementButton" onClick={this.incrementPortions}>+</button>
                                </div>

                                {/* ============================== Ingredients ============================== */}
                                <div className="recipeDetailsPageIngredients">
                                    <div className="recipeDetailsPageIngredientsLabel">Ingredients:</div>
                                    {!this.state.editModeActive ?
                                        <ul className="recipeDetailsPageIngredientsList">
                                            {Object.keys(ingredients).map((ingredient => {
                                                return (<li className="recipeDetailsPageIngredientsItem" key={ingredients[ingredient].name}>
                                                    <div className="recipeDetailsPageIngredientsItemAmount">{ingredients[ingredient].amount ? +(ingredients[ingredient].amount * this.state.dynamicIngredientsMultiplier).toFixed(4) : null}</div>
                                                    <div className="recipeDetailsPageIngredientsItemUnit">{ingredients[ingredient].unit === "N/A" ? null : ingredients[ingredient].unit}</div>
                                                    <div className="recipeDetailsPageIngredientsItemName">{ingredients[ingredient].name}</div>
                                                </li>);
                                            }))}
                                        </ul>
                                        :
                                        <>
                                            <div className="recipeDetailsPageIngredientsInput">
                                                <input className="recipeDetailsPageIngredientsInputAmount" type="number" name="currentIngredientAmount" placeholder="Amount" autoComplete="off" onChange={this.handleInputChange} value={this.state.currentIngredientAmount} minLength="1" maxLength="9" />
                                                <select className="recipeDetailsPageIngredientsInputUnitSelector" name="currentIngredientUnit" onChange={this.handleInputChange}>
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
                                                <input className="recipeDetailsPageIngredientsInputName" type="text" name="currentIngredientName" placeholder="Name" autoComplete="off" onChange={this.handleInputChange} value={this.state.currentIngredientName} minLength="1" maxLength="20" />
                                                <button className="recipeDetailsPageIngredientsInputAddButton" onClick={this.addIngredient}>Add</button>
                                            </div>

                                            <ul className="recipeDetailsPageIngredientsList">
                                                {Object.keys(this.state.ingredients).map((ingredient => {
                                                    return (<li className="recipeDetailsPageIngredientsItem" key={this.state.ingredients[ingredient].name}>
                                                        <div className="recipeDetailsPageIngredientsItemAmount">{this.state.ingredients[ingredient].amount}</div>
                                                        <div className="recipeDetailsPageIngredientsItemUnit">{this.state.ingredients[ingredient].unit === "N/A" ? null : this.state.ingredients[ingredient].unit}</div>
                                                        <div className="recipeDetailsPageIngredientsItemName">{this.state.ingredients[ingredient].name}</div>
                                                        <div className="recipeDetailsPageIngredientsItemRemove"><button className="recipeDetailsPageIngredientsItemRemoveButton" onClick={() => this.removeIngredient(this.state.ingredients[ingredient])}>X</button></div>
                                                    </li>);
                                                }))}
                                            </ul>
                                        </>
                                    }
                                    {!this.state.editModeActive &&
                                        <div className="recipeDetailsPageIngredientsErrorLabel">
                                            {this.state.ingredientInputError}
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="recipeDetailsPageBottomRight">
                                {/* ============================== Instructions ============================== */}
                                <div className="recipeDetailsPageInstructions">
                                    <div className="recipeDetailsPageInstructionsLabel">Instructions:</div>
                                    {!this.state.editModeActive ?
                                        <div className="recipeDetailsPageInstructionsText">{currentRecipe.instructions}</div>
                                        :
                                        <textarea className="recipeDetailsPageInstructionsInput" name="instructions" onChange={(e) => this.instructionsTextareaChange(e.target)} ref={this.instructionsTextAreaRef} value={this.state.instructions} placeholder="Add instructions" required />
                                    }
                                </div>
                            </div>
                        </div>

                        { /* ============================== Edit button ============================== */}
                        <div className="recipeDetailsPageEditRecipe">
                            <div className="recipeDetailsPageEditRecipeErrorLabel">
                                {this.state.errorMessage}
                            </div>

                            {!this.state.editModeActive ?
                                <button className="recipeDetailsPageEditRecipeButton" onClick={this.activateEditMode}>Edit recipe</button>
                                :
                                this.state.recipeChangesUploading ?
                                    <div className="recipeDetailsPageUploadingEditLoader">
                                        <PulseLoader
                                            size={15}
                                            color={"#123abc"}
                                            loading={this.state.recipeChangesUploading}
                                        />
                                    </div>
                                    :
                                    <div className="recipeDetailsPageEditRecipeModeButtons">
                                        <button className="recipeDetailsPageEditRecipeButton" >Save</button>
                                        <button className="recipeDetailsPageEditRecipeButton" onClick={this.cancelEditMode}>Cancel</button>
                                        <button className="recipeDetailsPageEditRecipeButton" onClick={this.deleteRecipe}>Delete</button>
                                    </div>
                            }
                        </div>
                    </>
                    :
                    <div className="recipeDetailsPageDataLoader">
                        <PulseLoader
                            size={15}
                            color={"#123abc"}
                            loading={this.dataLoading}
                        />
                    </div>
                }
            </form>
        );
    }
}

export default withRouter(RecipeDetailsPage);