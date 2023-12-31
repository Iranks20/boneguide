import React from "react";
import {
  View,
  Animated,
  Easing,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";

import Icon from "react-native-remix-icon";
import GlobalContext from "../contexts/GlobalContext";

class AnimatedSearchbox extends React.Component {
  state = {
    width: 0,
    textInputAnimated: new Animated.Value(0),
    parentViewWidthAnimated: new Animated.Value(this.props.height),
    isScaled: false,
  };

  //Get parent width value
  onLayout = (e) => {
    const { width } = e.nativeEvent.layout;
    this.setState({ width });
  };

  //Search icon
  searchIcon = () => {
    const { searchIconSize, searchIconColor } = this.props;

    return <Icon name="search-line" size="23" color="black" />;
  };

  //Animation start - open effect
  open = () => {
    const {
      focusAfterOpened,
      animationSpeed,
      onOpened,
      onOpening,
      setSearchOpened,
    } = this.props;
    onOpening && onOpening();

    setSearchOpened(true);

    Animated.timing(this.state.textInputAnimated, {
      toValue: 1,
      duration: animationSpeed[0],
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        this.setState({ isScaled: true });

        Animated.timing(this.state.parentViewWidthAnimated, {
          toValue: this.state.width,
          duration: animationSpeed[1],
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          onOpened && onOpened();
          if (focusAfterOpened) this.refTextInput.focus();
        });
      }, 125);
    });

    this.refTextInput.focus();
  };

  //Animation start - close effect
  close = () => {
    const { animationSpeed, onClosed, onClosing, setSearchOpened } = this.props;
    onClosing && onClosing();

    setSearchOpened(false);

    Animated.timing(this.state.parentViewWidthAnimated, {
      toValue: this.props.height,
      duration: animationSpeed[1],
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      this.setState({ isScaled: false });

      setTimeout(() => {
        Animated.timing(this.state.textInputAnimated, {
          toValue: 0,
          duration: animationSpeed[0],
          easing: Easing.linear,
          useNativeDriver: false,
        }).start(() => {
          onClosed && onClosed();
        });
      }, 125);
    });

    this.refTextInput.blur();
  };

  render() {
    const {
      height,
      borderRadius,
      fontSize,
      backgroundColor,
      placeholderTextColor,
      shadowColor,
      placeholder,
    } = this.props;

    return (
      <View onLayout={this.onLayout} styles={styles.container}>
        <Animated.View
          style={[
            styles.animatedContainer,
            {
              transform: [
                { scaleX: this.state.textInputAnimated },
                { scaleY: this.state.textInputAnimated },
              ],
              opacity: this.state.textInputAnimated,
              width: this.state.parentViewWidthAnimated,
            },
          ]}
        >
          <GlobalContext.Consumer>
            {({ searchQuery, setSearchQuery }) => (
              <>
                <TextInput
                  {...this.props}
                  ref={(ref) => (this.refTextInput = ref)}
                  placeholderTextColor={
                    this.state.isScaled ? placeholderTextColor : "#667085"
                  }
                  placeholder={placeholder}
                  style={[
                    styles.input,
                    {
                      shadowColor: shadowColor,
                      height: height,
                      borderRadius: 8,
                      fontSize: fontSize,
                      paddingLeft: height,
                    },
                  ]}
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                  // selectionColor="#476ffc"
                />

                {this.state.isScaled && (
                  <>
                    <TouchableOpacity
                      onPress={() => setSearchQuery("")}
                      style={{
                        ...styles.inputSearchIcon,
                        width: height,
                        height: height,
                        left: 'auto',
                        right: 0,
                      }}
                    >
                      <Icon name="close-line" color="#667085" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        this.close();
                        setSearchQuery("");
                      }}
                      style={[
                        styles.inputSearchIcon,
                        { width: height, height: height },
                      ]}
                    >
                      <Icon name="arrow-left-line" color="#667085" />
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
          </GlobalContext.Consumer>
        </Animated.View>

        {this.state.isScaled ? null : (
          <>
            <TouchableOpacity
              onPress={this.open}
              style={[
                styles.inputClosedSearchIcon,
                { width: height, height: height },
              ]}
            >
              {this.searchIcon()}
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  animatedContainer: {
    marginLeft: "auto",
  },
  searchInput: {
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 12,
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    height: 43,
    fontSize: 16,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,

    backgroundColor: "#ffffff",
    borderColor: "#D0D5DD",
    color: "#000000",
    shadowColor: "#D0D5DD",

    paddingLeft: 40,
  },

  inputSearchIcon: {
    position: "absolute",
    left: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputClosedSearchIcon: {
    position: "absolute",
    right: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

AnimatedSearchbox.defaultProps = {
  height: 48,
  borderRadius: 3,
  searchIconColor: "#555555",
  searchIconSize: 20,
  focusAfterOpened: false,
  placeholderTextColor: "#555555",
  fontSize: 16,
  backgroundColor: "#F5F5F5",
  shadowColor: "rgba(0,0,0,0.12)",
  animationSpeed: [200, 250],
};

AnimatedSearchbox.propTypes = {
  height: PropTypes.number,
  borderRadius: PropTypes.number,
  fontSize: PropTypes.number,
  backgroundColor: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  searchIconSize: PropTypes.number,
  searchIconColor: PropTypes.string,
  focusAfterOpened: PropTypes.bool,
  shadowColor: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  animationSpeed: PropTypes.array,
  onOpened: PropTypes.func,
  onClosed: PropTypes.func,
  onOpening: PropTypes.func,
  onClosing: PropTypes.func,
};

export default AnimatedSearchbox;
