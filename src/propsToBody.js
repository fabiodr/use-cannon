import {
  Body,
  Box,
  ConvexPolyhedron,
  Cylinder,
  Heightfield,
  Material,
  Particle,
  Plane,
  Quaternion,
  Sphere,
  Trimesh,
  Vec3,
} from 'cannon-es'

function createShape(type, args) {
  switch (type) {
    case 'Box':
      return new Box(new Vec3(...args.map((v) => v / 2))) // extents => halfExtents
    case 'ConvexPolyhedron':
      const [v, f, n] = args
      return new ConvexPolyhedron({
        vertices: v.map(([x, y, z]) => new Vec3(x, y, z)),
        normals: n ? n.map(([x, y, z]) => new Vec3(x, y, z)) : null,
        faces: f,
      })
    case 'Cylinder':
      return new Cylinder(...args) // [ radiusTop, radiusBottom, height, numSegments ] = args
    case 'Heightfield':
      return new Heightfield(...args) // [ Array data, options: {minValue, maxValue, elementSize}  ] = args
    case 'Particle':
      return new Particle() // no args
    case 'Plane':
      return new Plane() // no args, infinite x and y
    case 'Sphere':
      return new Sphere(...args) // [radius] = args
    case 'Trimesh':
      return new Trimesh(...args) // [vertices, indices] = args
  }
}

/**
 *
 * @param uuid {string}
 * @param props {BodyProps}
 * @param type {BodyShapeType}
 * @return {module:objects/Body.Body}
 */
const propsToBody = (uuid, props, type) => {
  const {
    args = [],
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1],
    velocity = [0, 0, 0],
    angularVelocity = [0, 0, 0],
    linearFactor = [1, 1, 1],
    angularFactor = [1, 1, 1],
    type: bodyType,
    mass,
    material,
    shapes,
    onCollide,
    collisionResponse,
    ...extra
  } = props

  const body = new Body({
    ...extra,
    mass: bodyType === 'Static' ? 0 : mass,
    type: bodyType ? Body[bodyType.toUpperCase()] : undefined,
    material: material ? new Material(material) : undefined,
  })
  body.uuid = uuid

  if (collisionResponse !== undefined) {
    body.collisionResponse = collisionResponse
  }

  if (type === 'Compound') {
    shapes.forEach(({ type, args, position, rotation, material, ...extra }) => {
      const shapeBody = body.addShape(
        createShape(type, args),
        position ? new Vec3(...position) : undefined,
        rotation ? new Quaternion().setFromEuler(...rotation) : undefined,
      )
      if (material) shapeBody.material = new Material(material)
      Object.assign(shapeBody, extra)
    })
  } else {
    body.addShape(createShape(type, args))
  }

  body.position.set(position[0], position[1], position[2])
  body.quaternion.setFromEuler(rotation[0], rotation[1], rotation[2])
  body.velocity.set(velocity[0], velocity[1], velocity[2])
  body.angularVelocity.set(angularVelocity[0], angularVelocity[1], angularVelocity[2])
  body.linearFactor.set(linearFactor[0], linearFactor[1], linearFactor[2])
  body.angularFactor.set(angularFactor[0], angularFactor[1], angularFactor[2])
  return body
}

export default propsToBody
